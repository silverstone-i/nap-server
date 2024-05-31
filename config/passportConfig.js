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

const verify = async (email, password, done) => {
  // console.log('Verify function called');
  if (!email || !password) {
    return done(null, false, { message: 'Missing required fields' });
  }

  try {
    const dto = {
      id: '',
      email: email,
      name: '',
      password_hash: '',
      role: '',
      _condition:
        'WHERE email = ${email} AND is_user = true AND archived = false',
    };

    const employee = await db.employees.selectOne(dto);

    if (!employee) {
      return done(null, false, { message: 'Incorrect user or password' });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      employee.password_hash
    );

    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect user or password' });
    }

    delete employee.password_hash;
    employee.email = email;

    return done(null, employee);
  } catch (error) {
    console.error('Error verifying user:', error.message, error.stack);
    return done(error);
  }
};

const strategy = new LocalStrategy(customFields, verify);

passport.use(strategy);

// Passport Serialize and Deserialize user

passport.serializeUser((user, done) => {
  console.log('SERIALIZE', user);
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  console.log('DESERIALIZE', userId);
  const dto = {
    id: userId,
    email: '',
    role: '',
    name: '',
    _condition: 'WHERE id = ${id} AND is_user = true AND archived = false',
  };

  try {
    const employee = await db.employees.selectOne(dto);
    if (!employee) {
      return done(null, false);
    } else {
      employee.id = userId;
      return done(null, employee);
    }
  } catch (error) {
    console.error('Error deserializing user:', error.message, error.stack);
    done(error);
  }
});

module.exports = passport;
