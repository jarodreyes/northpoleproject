var express = require('express')
  , router = express.Router()
  , twilio = require('twilio')
  , User = require('../models/User');

// POST: /recordings
router.post('/', function (req, res) {
  var userId = req.query.userId;
  if (userId) {
    User.findOne({ _id: userId })
    .then(function (user) {
      user.recordings.push({
        phoneNumber: req.body.From,
        transcription: req.body.TranscriptionText,
        url: req.body.RecordingUrl
      });
      return user.save();
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

module.exports = router;
