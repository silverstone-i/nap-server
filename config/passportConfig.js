'./config/passport.js';

/**
 *
 * Copyright © 2024-present, Ian Silverstone
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./dbConfig');
const bcrypt = require('bcrypt');

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
};

const verify = (email, password, done) => {
  db.users
    .login(email)
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {
          message: 'Incorrect username or password.',
        });
      } else {
        delete user.password;
        return done(null, user);
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verify);

passport.use(strategy);

// Passport Serialize and Deserialize user

passport.serializeUser((user, done) => {
  // console.log('SERIALIZE', user);
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  // console.log('DESERIALIZE', userId);
  const dto = {
    id: userId,
    email: '',
    role: '',
    employee_id: '',
    _condition: 'WHERE id = ${id} AND archived = false',
  };

  const qUser =
    'SELECT "id", "name", "email", "role", "employee_id" FROM login WHERE id = $1 AND archived = false;';
  db.one(qUser, [userId])
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

module.exports = passport;
