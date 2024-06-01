'./dbModels/Vendors.js';

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

class Vendors extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'vendors',
      columns: {
        id: { type: 'uuid', primaryKey: true, default: 'uuid_generate_v4()' },
        name: { type: 'varchar(255)' },
        email: { type: 'varchar(255)' },
        phone_number: { type: 'varchar(20)', nullable: true },
        contact: { type: 'varchar(255)', nullable: true },
        contact_phone: { type: 'varchar(20)', nullable: true },
        contact_email: { type: 'varchar(255)', nullable: true },
        is_user: { type: 'boolean', default: false },
        role: { type: 'varchar(50)', nullable: true },
        archived: { type: 'boolean', default: false },
      },
    });
  }
}

module.exports = Vendors;
