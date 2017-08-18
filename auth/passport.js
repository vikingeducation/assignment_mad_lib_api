const BearerStrategy = require('passport-http-bearer').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');

const bcrypt = require('bcrypt');
const passport = require('passport');

module.exports = passport;

module.exports.auth = () => {
    const localStrategy = new LocalStrategy(
        {
            // Set username field to email
            // to match form
            usernameField: 'username',
            passwordField: 'password'
        },
        (username, password, done) => {
            // Find user by username

            User.findOne({ username: username })
                .then(user => {
                    console.log('used passport login');
                    // The user is valid if the password is valid
                    const isValid = bcrypt.compareSync(password, user.password);

                    // If the user is valid pass the user
                    // to the done callback
                    // Else pass false
                    return done(null, isValid ? user : false);
                })
                .catch(e => done(null, false));
        }
    );

    const bearerStrategy = new BearerStrategy((token, done) => {
        // Find the user by token
        console.log('used bearer authenticate');
        User.findOne({ token: token })
            .then(user => {
                // Pass the user if found else false
                return done(null, user || false);
            })
            .catch(e => done(null, false));
    });

    passport.use(localStrategy);
    passport.use(bearerStrategy);

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
