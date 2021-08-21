const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
		done(err, user);
    });
});

passport.use(new LocalStrategy(
    (username, password, done) => {
		console.log(username)
		User.findOne({ username: username }, async (err, user) => {
			if (err) { 
				console.log(err.message);
				return done(err); 
			}
			console.log(user);
			if (!user) {  return done(null, false, {message: 'Please make sure that the username/password is correct'}) }
			if (!user.emailConfirmed) {  return done(null, false, {message: 'Please confirm your account via email to log in.'}) }
			bcrypt.compare(password, user.password, (err, result) => {
				console.log(result)
				if (result == true) {
					return done(null, user);
				} else {
					return done(null, false, {message: 'Please make sure that the username/password is correct'});
				}
			});
		});
    }
));