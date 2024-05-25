'./config/dbConfig.js'

/**
*
* Copyright © 2024-present, Ian Silverstone
*
* See the LICENSE file at the top-level directory of this distribution
* for licensing information.
*
* Removal or modification of this copyright notice is prohibited.
*/

const { DB } = require('nap-db');
const Users = require('../dbModels/Users');
const Employees = require('../dbModels/Employees');
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
