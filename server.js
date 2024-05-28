'/server.js';

/**
 *
 * Copyright © 2024-present, Ian Silverstone
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

require('dotenv').config();
const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('./config/passportConfig');
const pgSession = require('connect-pg-simple')(session);
const db = require('./config/dbConfig');
const routes = require('./routes/routes');
const app = express();

/**
 * -------------- PORT SETUP ----------------
 */
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

/**
 * -------------- LOGGER SETUP ----------------
 */
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.colorize(),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'debug.log', level: 'debug' }),
  ],
});

app.use(morgan('dev'));
//! FIX: morgan is not logging to the combined.log file
// app.use(morgan('combined', { stream: logger.stream }));

/**
 * -------------- CORS SETUP ----------------
 */
corsOptions = {
  origin: `http://${host}:${port}`,
  optionsSuccessStatus: 200,
};
app.use(cors(/*corsOptions*/));

/**
 * -------------- EXPRESS SETUP ----------------
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it

const sessionStore = new pgSession({
  conString: process.env.DATABASE_URL,
});

app.use(
  session({
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: false, // set to true if your using https
      maxAge: 1000 * 60 * 30, // 30 minutes
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   console.log('SESSION', req.session);
//   console.log('USER',req.user);
//   next();
// });

app.use('/auth', routes.authRoutes);
app.use('/employees', routes.employeeRoutes);

// Simple test of "/" route - sytem health check
app.get('/', (req, res) => {
  res.send(
    '<h1 style="background-color: #6d426d; color: #fff; padding: 20px; text-align: center;">Connected to nap server!</h1>'
  );
});

// TODO: Routes

// Catch all error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  return res.status(500).send('Internal server error!');
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Error in server setup: ', err);
  }
  console.log(`Server is running on http://${host}:${port}`);
});
