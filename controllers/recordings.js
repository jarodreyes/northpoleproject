var config = require('../config');
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var twilioClient = require('twilio')(config.accountSid, config.authToken);
var momentTimeZone = require('moment-timezone');
var moment = require('moment');

// POST: /recordings
router.post('/', function (req, res) {
  var userId = req.query.userId;
  var url = req.body.RecordingUrl;
  var sid = req.body.RecordingSid;
  
  if (userId) {
    User.findOne({ _id: userId })
    .then(function (user) {
      if (user.recordings.length === 0) {
        user.recordings.push({
          url: url,
        });
        user.sendRecording(url, sid);
        if (!user.called) user.called = true;
        return user.save();
      }
    })
    .then(function () {
      // Send recording to the user email
      res.status(201).send('Recording created');
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send('Could not create a recording');
    });
  } else {
    res.status(201).send('Recording ended, nothing created.');
  }
});


router.post('/incoming', function (req, res) {
  var userPhone = req.body.From;
  var input = req.body.Body.toLowerCase();
  var consent = input.indexOf('y') > -1 ? true : false;
  
  if (userPhone && consent) {
    User.findOne({ phoneNumber: userPhone })
    .then(function (user) {
      console.log(userPhone, user.phoneNumber);
      var time = momentTimeZone(user.time).tz(user.timeZone).format('MMMM Do YYYY [at] h:mm a');
      var message = 'How Exciting! One of Santas helpers will be calling +'+ user.countryCode +' '+ user.phone +' on '+time+'. Make sure the recipient of the call is nearby. :)';
      if (!user.consented) {
        user.consented == true;
        user.sendMessage(message, function(err) {
          if (err) {
              req.flash('errors', 'You are signed up, but '
                  + 'we could not send you a message. Our bad :(');
          }

          // show success page
          req.flash('successes', message);
        });
        return user.save();
      }
    })
    .then(function () {
      // Send recording to the user email
      res.status(201).send('User Consented and Welcome message sent!');
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send('Could not find a user with this phone number.');
    });
  } else {
    res.status(201).send('Recording ended, nothing created.');
  }
});

router.get('/delete', function (req, res) {
  var recordingSid = req.query.sid;
  twilioClient.recordings(recordingSid).delete(function(err, data) {
    if (err) {
      console.log(err.status);
      throw err.message;
    } else {
      console.log("Sid "+recordingSid+" deleted successfully.");
      return res.status(201).send('Recording deleted successfully.');
    }
  });
});



module.exports = router;
