'./dbModels/Customers.js';

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

class Customers extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'customers',
      columns: {
        id: { type: 'uuid', primaryKey: true, default: 'uuid_generate_v4()' },
        primary_customer: { type: 'varchar(255)' },
        primary_email: { type: 'varchar(255)' },
        primary_phone: { type: 'varchar(15)' },
        secondary_customer: {
          type: 'varchar(255)',
          nullable: true,
          default: "''",
        },
        secondary_email: {
          type: 'varchar(255)',
          nullable: true,
          default: "''",
        },
        secondary_phone: { type: 'varchar(15)', nullable: true, default: "''" },
        is_user: { type: 'boolean', default: false },
        role: { type: 'varchar(50)', nullable: true, default: "'customer'" },
        archived: { type: 'boolean', default: false },
      },
    });
  }
}

module.exports = Customers;
