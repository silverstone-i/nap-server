'./dbModels/Addresses.js';

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

class Addresses extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'addresses',
      columns: {
        id: { type: 'uuid', primaryKey: true, default: 'uuid_generate_v4()' },
        owner_type: { type: 'varchar(50)' },
        description: { type: 'varchar(25)' },
        address: { type: 'varchar(255)' }
      },
      constraints: {
        chk_owner_type: "CHECK (owner_type IN ('employee', 'vendor', 'customer'))"
      },
    });
  }
}

module.exports = Addresses;
