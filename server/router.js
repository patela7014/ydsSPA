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
    app.get('/', requireAuth, function(req, res) {
        res.send({ message: 'Super secret code is ABC123' });
    });
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
    app.get('/users', users);
    app.get('/user/:family_id/:user_id', view_user);
    app.post('/user/:user_id', saveUser);
    app.get('/events', events);
    app.post('/events', saveEvent);

    app.get('/events/:event_id/sabha/:sabha_id/attendance', sabhaUsers);
    app.post('/events/:event_id/attendance', saveEventAttendance);

    app.get('/sabhas', sabhas); 

    app.post('/addevent', (req, res)=>{console.log('req', req);res.send({success:true})});
}

