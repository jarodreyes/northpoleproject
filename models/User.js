var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var config = require('../config');
var moment = require('moment');
var Emailer = require('../emailer');

// Create authenticated Authy and Twilio API clients
var authy = require('authy')(config.authyKey);
var twilioClient = require('twilio')(config.accountSid, config.authToken);

// Used to generate password hash
var SALT_WORK_FACTOR = 10;

var Recording = new mongoose.Schema({
  url:           String,
  transcription: String,
  phoneNumber:   String
});

// Define user model schema
var UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    authyId: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    notification : Number,
    timeZone : String,
    time : {type : Date, index : true},
    recordings:  [Recording]
});

// Middleware executed before save - hash the user's password
UserSchema.pre('save', function(next) {
    var self = this;

    // only hash the password if it has been modified (or is new)
    if (!self.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(self.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            self.password = hash;
            next();
        });
    });
});

// Test candidate password
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    var self = this;
    bcrypt.compare(candidatePassword, self.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Send a verification token to this user
UserSchema.methods.sendAuthyToken = function(cb) {
    var self = this;

    if (!self.authyId) {
        // Register this user if it's a new user
        authy.register_user(self.email, self.phone, self.countryCode, 
            function(err, response) {
                
            if (err || !response.user) return cb.call(self, err);
            self.authyId = response.user.id;
            self.save(function(err, doc) {
                if (err || !doc) return cb.call(self, err);
                self = doc;
                sendToken();
            });
        });
    } else {
        // Otherwise send token to a known user
        sendToken();
    }

    // With a valid Authy ID, send the 2FA token for this user
    function sendToken() {
        authy.request_sms(self.authyId, true, function(err, response) {
            cb.call(self, err);
        });
    }
};

// Test a 2FA token
UserSchema.methods.verifyAuthyToken = function(otp, cb) {
    var self = this;
    authy.verify(self.authyId, otp, function(err, response) {
        cb.call(self, err, response);
    });
};

// Send a text message via twilio to this user
UserSchema.methods.sendMessage = function(message, cb) {
    var self = this;
    twilioClient.sendMessage({
        to: self.countryCode+self.phone,
        from: config.twilioNumber,
        body: message
    }, function(err, response) {
        cb.call(self, err);
    });
};

// Send a text message via twilio to this user
UserSchema.methods.sendRecording = function(url) {
    Emailer.sendEmail(this, url);
};

// Check if User needs a phonecall
UserSchema.methods.requiresCall = function (date) {
    var self = this;
    try {
        console.log('Do I require a call?');
        var schedule = moment(self.time).tz(self.timeZone).utc();
        var now = moment(date).utc();
        var diff = moment.duration(schedule.diff(now)).asMinutes();
        var timing = Math.round(diff);
        console.log("Schedule: "+ schedule);
        console.log("Now: "+now);
        console.log("Diff: "+diff);
        console.log("Timing: "+timing);
        console.log("This Notification:" +self.notification)
        return timing === self.notification;
        // return timing === -8;
    } catch(err) {
        console.log("ERROR! "+err);
    }
    
};

// Make call to User
UserSchema.statics.makeCalls = function(callback) {

  // now
  var searchDate = new Date();
  User
    .find()
    .then(function (users) {
        console.log('Found some Users potentially!');
        users = users.filter(function(user) {
            console.log('Searching Users.');
            return user.requiresCall(searchDate);
        });
        if (users.length > 0) {
            makeCalls(users);
        }
    });

    // Send messages to all appoinment owners via Twilio
    function makeCalls(niceKids) {
        niceKids.forEach(function(user) {
            // Create options to send the message
            var options = {
                to: "+"+user.countryCode + user.phone,
                from: config.twilioNumber,
                url: 'http://jreyes.ngrok.io/ivr/welcome?userId=' + user.id,
                record: true,
                recordingStatusCallback: 'http://jreyes.ngrok.io/recordings?userId='+ user.id
            };

            // Send the message!
            twilioClient.calls.create(options)
            .then(function(call) {
                console.log('call completed');
            }).fail(function(error) {
                if(error) throw error;
            });
        });

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
          callback.call(this);
        }
    }
};

// Export user model
var User = mongoose.model('User', UserSchema);
module.exports = User;