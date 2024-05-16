'./auth/passportSetup.js'

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/dbConfig');

passport.use(new LocalStrategy(
    function(email, password, done) {
        db.oneOrNone('SELECT id, email, password_hash FROM users WHERE email = $1', [email])
        .then(user => {
            if (!user) {
            console.log(`No user found with email: ${email}`);
            return done(null, false, { message: 'Incorrect user or password.' });
            }
    
            bcrypt.compare(password, user.password_hash, function(err, res) {
            if (err) {
                console.error('Error comparing passwords:', err);
                return done(err);
            }
            if (res) {
                // passwords match! log user in
                console.log(`User ${email} authenticated successfully.`);
                return done(null, user);
            } else {
                // passwords do not match!
                console.log(`Password mismatch for user: ${email}`);
                return done(null, false, { message: 'Incorrect user or password' });
            }
            });
        })
        .catch(err => {
            console.error('Error during user authentication:', err);
            done(err);
        });
    }
    ));

// Serialize user into the sessions
passport.serializeUser(function(user, done) {
    console.log(`Serializing user: ${user.id}`);
    done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser(function(id, done) {
    db.oneOrNone('SELECT id, email FROM users WHERE id = $1', [id])
    .then(user => {
        console.log(`Deserializing user: ${id}`);
        done(null, user);
    })
    .catch(err => {
        console.error('Error deserializing user:', err);
        done(err, null);
    });
});

module.exports = passport;

