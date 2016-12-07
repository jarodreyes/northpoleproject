var home = require('./home');
var users = require('./users');
var ivr = require('./ivr');
var recordings = require('./recordings');

// Map routes to controller functions
module.exports = function(app) {
    // Render home page
    app.get('/', home.show);
    app.post('/email', home.email);

    // Routes for account creation
    app.get('/users/new', users.showCreate);
    app.post('/users', users.create);
    app.get('/users/:id/verify', users.showVerify);
    app.post('/users/:id/verify', users.verify);
    app.post('/users/:id/resend', users.resend);
    app.get('/users/:id', users.showUser);
    app.use('/ivr', ivr);
    app.use('/recordings', recordings);
};