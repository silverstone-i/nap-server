'./dbModels/Employees.js';

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

class Employees extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'employees',
      columns: {
        id: { type: 'uuid', primaryKey: true, default: 'uuid_generate_v4()' },
        first_name: { type: 'varchar(50)' },
        last_name: { type: 'varchar(50)' },
        email: { type: 'varchar(255)' },
        phone_number: { type: 'varchar(20)', nullable: true },
        tax_id: { type: 'varchar(50)', nullable: true },
        is_user: { type: 'boolean', default: false },
        name: {
          type: 'varchar(101)',
          generated: "(first_name || ' ' || last_name)",
        },
        password_hash: { type: 'varchar(255)', nullable: true, default: null },
        role: { type: 'varchar(50)', nullable: true, default: null },
        archived: { type: 'boolean', default: false },
      },
      uniqueConstraints: {
        employees_email: { columns: ['email'] },
      },
    });
  }
}

module.exports = Employees;
