'../util/createTables.js';

/**
 *
 * Copyright © 2024-present, Ian Silverstone
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

const db = require('../config/dbConfig');

// console.log(db.vendors.createTableQuery());

// Create the tables
const createTables = async () => {
  console.log('Creating tables...');
  await db.employees.init();
  await db.vendors.init();
  await db.customers.init();
  await db.addresses.init();
  // await db.vendorAddresses.init();
  // await db.employeeAddresses.init();
  // await db.customerAddresses.init();
  console.log('Tables created');
  process.exit();
};

createTables();

module.exports = createTables;
