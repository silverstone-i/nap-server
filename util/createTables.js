'../util/createTables.js';

// const { DB } = require('nap-db');
const db = require('../config/dbConfig');

// Create the tables
const createTables = async () => {
  console.log('Creating tables...' );
  await db.employees.init();
  await db.users.init();
  console.log('Tables created');
  process.exit();
};

createTables();

module.exports = createTables;
