require('dotenv').config();
const app = require('express')();
const { DB } = require('nap-db ');

const port = process.env.PORT || 3000;

// Initialize the database
const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const repositories = {};

const db = DB.init(connection, repositories);


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
  console.log(`Server is running on port ${port}`);
});
