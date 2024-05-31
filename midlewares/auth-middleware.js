'./middlewares/auth-middleware.js';

/**
 *
 * Copyright © 2024-present, Ian Silverstone
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  console.log('Authorized');
  next();
};

module.exports = isAuthenticated;
