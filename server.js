'/server.js'

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
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');
const routes = require('./routes/routes');


const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
corsOptions = {
  origin: `http://${host}:${port}`,
  optionsSuccessStatus: 200,
};

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

app.use(cors(/*corsOptions*/));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes.authRoutes);
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
  res.status(500).send('Internal servern error!');
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Error in server setup: ', err);
  }
  console.log(`Server is running on http://${host}:${port}`);
});
