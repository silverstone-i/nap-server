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
const db = require('./config/dbConfig');
const bcrypt = require('bcrypt');

const customFields = {
  usernameField: 'email',
  passwordField: 'password',
};

const verify = (email, password, done) => {
  const dto = {
    id: null,
    email: email,
    password: '',
    role: '',
    _condition: `WHERE email = ${email} AND archived = false`
  }

  db.users.select({ username: username })
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {
          message: 'Incorrect username or password.',
        });
      } else {
        return done(null, user);
      }
    })
    .catch((err) => {
      done(err);
    })
};

const strategy = new LocalStrategy(customFields, verify);

passport.use(strategy);

// Passport Serialize and Deserialize user



