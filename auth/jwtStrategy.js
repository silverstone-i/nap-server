'./auth/jwtStrategy.js';

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
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../db/dbConfig');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256'],
};

passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    console.log('Processing JWT authentication for user ID:', jwt_payload.id);
    db.oneOrNone('SELECT id, email, role FROM users WHERE id = $1', [
      jwt_payload.id,
    ])
      .then((user) => {
        if (user) {
          console.log('User authenticated with JWT:', user.email);
          return done(null, user);
        } else {
          console.log('User not found with JWT payload ID:', jwt_payload.id);
          return done(null, false);
        }
      })
      .catch((error) => {
        console.error(
          'Error during JWT authentication:',
          error.message,
          error.stack
        );
        return done(error, false);
      });
  })
);


