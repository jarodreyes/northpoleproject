var momentTimeZone = require('moment-timezone');
var moment = require('moment');

var getTimeZones = function(){
  return momentTimeZone.tz.names();
}

// Render home page
exports.show = function(request, response) {
    response.render('index', {
      timeZones: getTimeZones(),
      id: 'test'
    });
};

// Render home page
exports.privacy = function(request, response) {
    response.render('privacy', {
      title: 'Santa Phone - Privacy Statement'
    });
};

// Route receives emails from Sendgrid. Does nothing with them, just returns a 200 response.
exports.email = function(request, response) {
    console.log(JSON.stringify(request.body, true, 2));
    response.status(200).send('Ok got the email.');
};