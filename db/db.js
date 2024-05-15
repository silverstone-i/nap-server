// ./db/db.js
const { DB } = require('nap-db');
const Users = require('./Users');
const Employees = require('./Employees');
require('dotenv').config();

// Initialize the database
const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

// Initialize the repositories
const repositories = {
  employees: Employees,
  users: Users,
};

const db = DB.init(connection, repositories);

module.exports = db;
