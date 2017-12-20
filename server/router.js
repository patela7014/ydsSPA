const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
const {
    users,view_user, saveUser, handleLogin
} = require('./controllers/user_controller')

const {
    events, saveEventAttendance, saveEvent
} = require('./controllers/events_controller')

const {
    sabhas, sabhaUsers
} = require('./controllers/sabha_controller');

module.exports = function(app) {
    app.get('/api/', requireAuth, function(req, res) {
        res.send({ message: 'Super secret code is ABC123' });
    });
    app.post('/api/signin', requireSignin, Authentication.signin);
    app.post('/api/signup', Authentication.signup);
    app.get('/api/users', users);
    app.get('/api/user/:family_id/:user_id', view_user);
    app.post('/api/user/:user_id', saveUser);
    app.get('/api/events', events);
    app.post('/api/events', saveEvent);

    app.get('/api/events/:event_id/sabha/:sabha_id/attendance', sabhaUsers);
    app.post('/api/events/:event_id/attendance', saveEventAttendance);

    app.get('/api/sabhas', sabhas);

    app.post('/api/addevent', (req, res)=>{console.log('req', req);res.send({success:true})});
}

