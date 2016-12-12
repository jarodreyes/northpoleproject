var express = require('express')
  , router = express.Router()
  , twilio = require('twilio')
  , User = require('../models/User');

// POST: /ivr/events
// This is a webhook that receives every callStatus event triggered by the outgoing call. 
// The outgoing call is initiated by User.makeCalls()
router.post('/events', twilio.webhook({validate: false}), function (req, res) {
  var userId = req.query.userId;
  var url = req.body.RecordingUrl;
  var sid = req.body.RecordingSid;

  console.log("Events status is: "+req.body.CallStatus);

  // If the call was completed let's send the email with the recording.
  if (req.body.CallStatus === 'completed') {
    if (userId) {
      User.findOne({ _id: userId })
      .then(function (user) {
        if (url && user.recordings.length === 0) {
          user.recordings.push({
            url: url,
          });
          user.sendRecording(url, sid);
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
  // If the call was answered let's mark this user as being called.
  } else if (req.body.CallStatus === 'in-progress') {
    console.log('Checked user. Call completed. Status: '+req.body.CallStatus);
    if (userId) {
      User.findOne({ _id: userId })
      .then(function (user) {
        user.called = true;
        user.save();
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).send('Could not save user');
      });
    }
  } else {
    console.log("Call Status: "+req.body.CallStatus);
  }
});

// POST: /ivr/welcome
// Welcomes the child and asks them what they want for christmas.
router.post('/welcome', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var userId = req.query.userId;
  var twiml = new twilio.TwimlResponse();
  twiml
    .pause({length: 1})
    .play('http://jardiohead.s3.amazonaws.com/elf-first.mp3')
    .record({
      playBeep: true,
      timeout: 5,
      action: '/ivr/step2',
      transcribe: true
    })
    .redirect('/ivr/welcome')
  res.send(twiml.toString());
});

// POST: /ivr/step2
// Asks the child if there is anything else they would like to tell Santa?
router.post('/step2', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var userId = req.query.userId;
  var twiml = new twilio.TwimlResponse();
  twiml
    .play('http://jardiohead.s3.amazonaws.com/elf-second.mp3')
    .record({
      playBeep: true,
      timeout: 5,
      action: '/ivr/step3',
      transcribe: true
    })
    .redirect('/ivr/step2')
  res.send(twiml.toString());
});

// POST: /ivr/step3
// Last question. Asks the child if they have made nice choices today.
router.post('/step3', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var userId = req.query.userId;
  var twiml = new twilio.TwimlResponse();
  twiml
    .play('http://jardiohead.s3.amazonaws.com/elf-third.mp3')
    .record({
      playBeep: true,
      timeout: 5,
      action: '/ivr/step4',
      transcribe: true
    })
    .redirect('/ivr/step3')
  res.send(twiml.toString());
});

// POST: /ivr/step4
router.post('/step4', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var userId = req.query.userId;
  var twiml = new twilio.TwimlResponse();
  twiml
    .play('http://jardiohead.s3.amazonaws.com/elf-goodbye.mp3')
    .hangup();
  res.send(twiml.toString());
});

router.post('/join', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var userId = req.query.userId;
  var twiml = new twilio.TwimlResponse();
  twiml
    .dial({}, function(node) {
        node.conference(userId, {
            beep:'false',
        });
    });
  res.send(twiml.toString());
});

// Easter egg, if the user calls the number back, we need to have a response.
router.post('/music', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var twiml = new twilio.TwimlResponse();
  twiml.play('http://jardiohead.s3.amazonaws.com/jinglebells.mp3');
  res.send(twiml.toString());
});


module.exports = router;
