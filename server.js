require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');



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
// app.use(morgan('combined', { stream: logger.stream }));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));






// Simple test of "/" route
app.get('/', (req, res) => {
  res.send(
    '<h1 style="background-color: #6d426d; color: #fff; padding: 20px; text-align: center;">Connected to nap server!</h1>'
  );
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Error in server setup: ', err);
  }
  console.log(`Server is running on http://${host}:${port}`);
});
