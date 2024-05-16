'../util/createTables.js';

// const { DB } = require('nap-db');
const db = require('../db/dbConfig');

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
