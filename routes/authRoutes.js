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
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../config/dbConfig');

router.post('/register', async (req, res) => {
  if(!req.isAuthenticated()) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).send({ message: 'Missing required fields' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('USER', req.user);
    const result = await db.one(
      'INSERT INTO users(password, email, role, created_by) VALUES($1, $2, $3, $4) RETURNING id',
      [ hashedPassword, email, role, 'nap_admin']
    );
    console.log(`User registered with ID: ${result.id}`);
    res
      .status(201)
      .send({ message: 'User registered successfully', userId: result.id });
  } catch (error) {
    console.error('Error registering new user:', error.message, error.stack);
    res.status(500).send('Error registering new user');
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const user = req.user;
  console.log('LOGIN', user.email);
  res.status(200).send({ message: `User: ${user.email}` });
});

router.get('/validate', (req, res) => {
  res.status(200).send({ message: 'Token is valid', user: req.user });
});

module.exports = router;
