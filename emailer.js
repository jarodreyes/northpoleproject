var helper = require('sendgrid').mail;
var from_email = new helper.Email('helper@em.santaphone.org', "Santa's Helper");
var subject = "Santaphone.org: Official North Pole correspondence!";

var Emailer = function() { };

Emailer.prototype.sendEmail = function(user, url) {
  var to_email = new helper.Email(user.email);
  var content = new helper.Content('text/plain', "Happy Holidays "+user.fullName+"! Thanks for using the North Pole Project. We are happy to tell you that your adorable child has spoken with one of Santa's helpers and here is the recording:"+ url +".mp3?Download=true. Please follow @twilio on Twitter to learn more about how we built this fun project. Merry Christmas from Twilio!");
  var mail = new helper.Mail(from_email, subject, to_email, content);
  content = new helper.Content("text/html", '<div style="width:100%;"> <table width="100%" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:580px" align="center"> <tbody> <tr> <td align="center" style="word-break:normal;border-collapse:collapse;height:auto" valign="middle"><img alt="" class="header-logo" src="http://jardiohead.s3.amazonaws.com/email-topper.png" style="border:none;margin:0px;padding:0px;max-width:100%;width:100%;padding-bottom:0px"> </td> </tr> </tbody> </table> <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:580px" align="center"> <tbody> <tr> <td align="center" style="word-break:normal;border-collapse:collapse;height:auto;text-align:left; padding:20px;" valign="middle"> <p>Happy Holidays <i>'+user.fullName+'</i>!</p> <p>Thanks you for using the Santa Phone. One of Santa&#39;s helpers just spoke with your child and you can listen to the recording here: </p> <p><a href="'+ url +'" target="_blank" style="border-radius: 30em;display: inline-block; width: 190px; padding: 16px; font-family: Arial, sans-serif; text-transform: uppercase;background-color: #F22F46;color:white;text-align:center; text-decoration: none;">Listen Now</a> <a href="'+ url +'.mp3?Download=true" target="_blank" style="border-radius: 30em;display: inline-block; width: 190px; padding: 16px; font-family: Arial, sans-serif; text-transform: uppercase;background-color: #F22F46;color:white;text-align:center; text-decoration: none;">Download</a> </p> <p> For comments, questions or to get more fun updates like this follow Twilio on <a href="twitter.com/twilio" target="_blank">Twitter</a> and have a Merry Christmas!</p> <small>You can forward the email with the link to the recording to other family members to share the fun!  But, please remember, anyone who has the link to the recording can listen to or download the conversation (and forward the link to others) unless you ask us to delete the recording.  For information on how to request deletion of the conversation from our servers, please see our <a href="https://santaphone.org/privacy">privacy notice.</a></small> </td> </tr> </tbody> </table> <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:580px; margin-top:40px;" align="center"> <tbody> <tr> <td align="center" style="word-break:normal;border-collapse:collapse;height:auto" valign="middle"> <img width="300px" alt="" class="footer" src="http://jardiohead.s3.amazonaws.com/footer.png" style="border:none;margin:0px;padding:0px;max-width:100%;width:300px;padding-bottom:0px"> </td> </tr><tr> <td align="center" style="word-break:normal;border-collapse:collapse;height:auto" valign="middle"><small> 645 Harrison St, San Francisco, CA 94107</small></td></tr><tr> <td align="center" style="word-break:normal;border-collapse:collapse;height:auto" valign="middle"><a href="https://santaphone.org/privacy"> Privacy Statement </a></td></tr> </tbody> </table> </div>');
  mail.addContent(content);

  var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });
  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
};

module.exports = new Emailer();