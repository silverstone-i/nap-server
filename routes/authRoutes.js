'./routes/authRoutes.js';

/**
 *
 * Copyright © 2024-present, Ian Silverstone
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

const router = require('express').Router();
const passport = require('passport');

router.post('/login/employee', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error authenticating employee:', err.message, err.stack);
      return res.status(500).send({ message: 'Internal server error' });
    }
    if (!user) {
      console.error('Error authenticating employee:', info.message);
      return res.status(401).send({ message: 'Incorrect user or password' });
    }
    req.login(user, (err) => {
      if (err) {
        console.error('Error logging in employee:', err.message);
        return res.status(500).send({ message: 'Internal server error' });
      }
    });
    return res.status(200).send({ message: `Wecome ${user.name}!` });
  })(req, res, next);
});

module.exports = router;
