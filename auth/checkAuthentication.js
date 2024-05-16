'./auth/checkAuthentication.js'

/**
*
* Copyright © 2024-present, Ian Silverstone
*
* See the LICENSE file at the top-level directory of this distribution
* for licensing information.
*
* Removal or modification of this copyright notice is prohibited.
*/

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User is authenticated');
    return next();
  }
  console.error('User not authenticated');
  res.status(401).send('User not authenticated');
}

module.exports = checkAuthentication;
