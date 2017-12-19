var LocalStrategy = require('passport-local').Strategy;

var db = require('../models/db');
var user = require('../controllers/user_controller');

module.exports = function(passport) {

  // Passport session setup, required for persistent login sessions
  // Used to serialize and unserialize users out of session
  passport.serializeUser(function(user, done) {
      console.log("USASASAS", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      console.log('deserializing user:', id);
    db.query('SELECT * FROM login WHERE id = ?', [id], function(err, rows) {
      return done(err, rows[0]);
    });
  });

    // Local login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // Pass the entire request back to the callback
    }, user.handleLogin));
};
