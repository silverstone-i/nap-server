'./config/dbConfig.js';

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
const Employees = require('../dbModels/Employees');
const Vendors = require('../dbModels/Vendors');
const Addresses = require('../dbModels/Addresses');
const Customers = require('../dbModels/Customers');
const Projects = require('../dbModels/Projects');
require('dotenv').config();

// Initialize the repositories
const repositories = {
  employees: Employees,
  vendors: Vendors,
  customers: Customers,
  projects: Projects,
  addresses: Addresses,
};

console.log('Initializing database...');

const db = DB.init(process.env.DATABASE_URL, repositories);

console.log('Initialized database.');

module.exports = db;
