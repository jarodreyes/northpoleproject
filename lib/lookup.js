var config = require('../config');
var lookupsClient = require('twilio').LookupsClient;
var client = new lookupsClient(config.accountSid, config.authToken);

var internationalNumber = function(countryCode, pn) {
  console.log(countryCode, pn);
  client.phoneNumbers(pn).get({
    countryCode: countryCode,
    type: 'carrier'
  }, 
  function(error, number) {
    console.log(JSON.stringify(number));
    console.log(number.carrier.name);
    return number.phoneNumber;
  });
};

exports.internationalNumber = internationalNumber;
