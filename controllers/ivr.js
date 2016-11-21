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
    // .play('http://howtodocs.s3.amazonaws.com/et-phone.mp3')
    .say('What is your name?',
        { voice: 'alice', language: 'en-GB' })
    .record({
      playBeeb: false,
      timeout: 7,
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
    // .play('http://howtodocs.s3.amazonaws.com/et-phone.mp3')
    .say('Great. What would you like for christmas?',
        { voice: 'alice', language: 'en-GB' })
    .record({
      playBeeb: false,
      timeout: 7,
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
    .say('Is there anything else you would like to tell Santa?',
        { voice: 'alice', language: 'en-GB' })
    .record({
      playBeeb: false,
      timeout: 7,
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
    // .play('http://howtodocs.s3.amazonaws.com/et-phone.mp3')
    .say('Have a Merry Christmas and a happy new year!',
        { voice: 'alice', language: 'en-GB' })
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
    // .play('http://howtodocs.s3.amazonaws.com/et-phone.mp3')
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
