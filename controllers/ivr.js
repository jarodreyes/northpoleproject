var express = require('express')
  , router = express.Router()
  , twilio = require('twilio');

// POST: /ivr/welcome
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
      playBeep: false,
      timeout: 4,
      action: '/ivr/step2'
    })
  res.send(twiml.toString());
});

// POST: /ivr/welcome
router.post('/step2', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var userId = req.query.userId;
  var twiml = new twilio.TwimlResponse();
  twiml
    .play('http://jardiohead.s3.amazonaws.com/elf-second.mp3')
    .record({
      playBeep: false,
      timeout: 4,
      action: '/ivr/step3'
    })
  res.send(twiml.toString());
});

// POST: /ivr/welcome
router.post('/step3', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var userId = req.query.userId;
  var twiml = new twilio.TwimlResponse();
  twiml
    .play('http://jardiohead.s3.amazonaws.com/elf-third.mp3')
    .record({
      playBeep: false,
      timeout: 4,
      action: '/ivr/step4'
    })
  res.send(twiml.toString());
});

// POST: /ivr/welcome
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

router.post('/music', twilio.webhook({validate: false}), function (req, res) {
  if (req.body.CallStatus === 'completed') {
    return res.send('');
  }
  var twiml = new twilio.TwimlResponse();
  twiml.play('http://jardiohead.s3.amazonaws.com/jinglebells.mp3');
  res.send(twiml.toString());
});


module.exports = router;
