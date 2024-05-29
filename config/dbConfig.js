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
const Users = require('../dbModels/Users');
const Employees = require('../dbModels/Employees');
const Vendors = require('../dbModels/Vendors');
const Addresses = require('../dbModels/Addresses');
const Customers = require('../dbModels/Customers');
const VendorAddresses = require('../dbModels/VendorAddresses');
const EmployeeAddresses = require('../dbModels/EmployeeAddresses');
const CustomerAddresses = require('../dbModels/CustomerAddresses');
require('dotenv').config();

// Initialize the repositories
const repositories = {
  employees: Employees,
  users: Users,
  vendors: Vendors,
  addresses: Addresses,
  customers: Customers,
  vendorAddresses: VendorAddresses,
  employeeAddresses: EmployeeAddresses,
  customerAddresses: CustomerAddresses,
};

console.log('Initializing database...');

const db = DB.init(process.env.DATABASE_URL, repositories);

console.log('Initialized database.');

module.exports = db;
