'./routes/authRoutes.js'

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
const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../db/dbConfig');

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).send({ message: 'Missing required fields' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.one('INSERT INTO users(username, password_hash, email, role) VALUES($1, $2, $3, $4) RETURNING id', [username, hashedPassword, email, role]);
    console.log(`User registered with ID: ${result.id}`);
    res.status(201).send({ message: 'User registered successfully', userId: result.id });
  } catch (error) {
    console.error('Error registering new user:', error.message, error.stack);
    res.status(500).send('Error registering new user');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('LOGIN', email, password);
  if (!email || !password) {
    return res.status(400).send({ message: 'Missing email or password' });
  }
  try {
    const dto = {
      id: '',
      login_email: email,
      email: '',
      password: '',
      role: '',
      archived: '',
      _condition: 'WHERE email = ${login_email}'
    }
    
    const result = await db.users.select(dto);
    user = result[0];
    
    // const user = await db.oneOrNone('SELECT id, email, password_hash, role, archived FROM users WHERE email = $1', [email]);
    if (!user || user.archived) {
      console.log(`No user found with email: ${email}`);
      return res.status(401).send({ message: 'Incorrect email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log(`User ${email} authenticated successfully.`);
      res.status(200).send({ message: 'Authenticated successfully', token: token, user: { id: user.id, email: user.email, role: user.role } });
    } else {
      console.log(`Password mismatch for email: ${email}`);
      res.status(401).send({ message: 'Incorrect email or password' });
    }
  } catch (error) {
    console.error('Error during user login:', error.message, error.stack);
    res.status(500).send('Error logging in user');
  }
});

router.get('/validate', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).send({ message: 'Token is valid', user: req.user });
});

module.exports = router;