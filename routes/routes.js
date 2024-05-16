'./routes/routes.js';

/**
 *
 * Copyright © 2024-present, Ian Silverstone
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');

module.exports = { 
    authRoutes,
    employeeRoutes
 };
