'./dbModels/EmployeeAddresses.js';

/**
 *
 * Copyright © 2024-present, Ian Silverstone
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

const { Model } = require('nap-db');

class EmployeeAddresses extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'employee_addresses',
      columns: {
        employee_id: { type: 'uuid' },
        address_id: { type: 'uuid' },
      },
      constraints: {
        pk_employee_address: 'PRIMARY KEY (employee_id, address_id)',
        fk_emloyee_id:
          'FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE',
        fk_address_id:
          'FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE',
      },
    });
  }
}

module.exports = EmployeeAddresses;
