var express = require('express')
  , router = express.Router()
  , twilio = require('twilio')
  , User = require('../models/User');

// POST: /recordings
router.post('/', function (req, res) {
  var userId = req.query.userId;
  var url = req.body.RecordingUrl;
  
  if (userId) {
    User.findOne({ _id: userId })
    .then(function (user) {
      if (user.recordings.length === 0) {
        user.recordings.push({
          url: url,
        });
        user.sendRecording(url);
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

module.exports = router;
