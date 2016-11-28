var helper = require('sendgrid').mail;
var from_email = new helper.Email('santa@mail.twilio.codes');
var subject = "Your child's Christmas wishes!";

var Emailer = function() { };

Emailer.prototype.sendEmail = function(user, url) {
  var to_email = new helper.Email(user.email);
  var content = new helper.Content('text/plain', "Happy Holidays "+user.name+"! Thanks for using the North Pole Project. We are happy to tell you that your adorable child has spoken with one of Santa's helpers and here is the recording:"+ url +". Please follow northpoleproject on Twitter or email santa@mail.twilio.codes for updates from Santa. Merry Christmas!");
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });
  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};

module.exports = new Emailer();