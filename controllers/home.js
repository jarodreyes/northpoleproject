// Render home page
exports.show = function(request, response) {
    response.render('index');
};

exports.email = function(request, response) {
    console.log(JSON.stringify(request.body, true, 2));
    response.status(200).send('Ok got the email.');
};