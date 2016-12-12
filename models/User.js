var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
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
    consented: {
        type: Boolean,
        default: false
    },
    called: {
        type: Boolean,
        default: false
    },
    authyId: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    notification : Number,
    timeZone : String,
    time : {type : Date, index : true},
    recordings:  [Recording]
});

UserSchema.plugin(require('mongoose-lifecycle'));

// Middleware executed before save - hash the user's password
UserSchema.methods.findPreConsent = function() {
    var self = this;
    var previousConsent = false;
    console.log('finding Pre Consent');

    User
    .find({phone: self.phone})
    .then(function (users) {
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            console.log(user.email);
            if (user.consented) {
                previousConsent = true;
            }
        }
        self.consented = previousConsent;
        return self.save();
    });
};

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
UserSchema.methods.sendRecording = function(url, recordingSid) {
    console.log("Sending recording url: "+url);
    Emailer.sendEmail(this, url, recordingSid);
};

// Check if User needs a phonecall
UserSchema.methods.requiresCall = function (date) {
    var self = this;
    try {
        if (!self.called && self.verified && self.consented) {
            console.log('Do I require a call?');
            var schedule = moment(self.time).tz(self.timeZone).utc();
            var now = moment(date).utc();
            var diff = moment.duration(schedule.diff(now)).asMinutes();
            var timing = Math.round(diff);
            return timing <= self.notification;
        } else {
            return false;
        }
    } catch(err) {
        console.log("ERROR! "+err);
    }
    
};

// Make an outgoing call to any User who requires one. This is based on the time they scheduled the call.
UserSchema.statics.makeCalls = function(callback) {

  // now
  var searchDate = new Date();
  User
    .find()
    .then(function (users) {
        users = users.filter(function(user) {
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
                url: 'https://santaphone.org/ivr/welcome?userId=' + user.id,
                statusCallback: 'https://santaphone.org/ivr/events?userId=' + user.id,
                statusCallbackMethod: "POST",
                statusCallbackEvent: ["answered", "completed"],
                record: true,
                recordingStatusCallback: 'https://santaphone.org/recordings?userId=' + user.id,
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
User.on('beforeInsert', function(user) {
    user.findPreConsent();
});
module.exports = User;