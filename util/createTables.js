'../util/createTables.js';

// const { DB } = require('nap-db');
const db = require('../db/db');
// const Users = require('../db/Users');
// const Employees = require('../db/Employees');
// require('dotenv').config();

// Initialize the database
// const connection = {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// };

// const repositories = {
//   users: Users,
//   employees: Employees,
// };

// const db = DB.init(connection, repositories);

// Create the tables
const createTables = async () => {
  await db.employees.init();
  await db.users.init();
  console.log('Tables created');
  process.exit();
};

// console.log(db.employees.createTableQuery());

createTables();

module.exports = createTables;
