'./dbModels/CustomerAddresses.js';

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

class CustomerAddresses extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'customer_addresses',
      columns: {
        customer_id: { type: 'uuid' },
        address_id: { type: 'uuid' },
      },
      constraints: {
        pk_customer_address: 'PRIMARY KEY (customer_id, address_id)',
        fk_customer_id:
          'FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE',
        fk_address_id:
          'FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE',
      },
    });
  }
}

module.exports = CustomerAddresses;
