// Render home page
exports.show = function(request, response) {
    response.render('index');
};

// Route receives emails from Sendgrid. Does nothing with them, just returns a 200 response.
exports.email = function(request, response) {
    console.log(JSON.stringify(request.body, true, 2));
    response.status(200).send('Ok got the email.');
};