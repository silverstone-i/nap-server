'./dbModels/VendorAddresses.js';

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

class VendorAddresses extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'vendor_addresses',
      columns: {
        vendor_id: { type: 'uuid' },
        address_id: { type: 'uuid' },
      },
      constraints: {
        pk_vendor_address: 'PRIMARY KEY (vendor_id, address_id)',
        fk_vendor_id: 'FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE',
        fk_address_id: 'FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE',
      },
    });
  }
}

module.exports = VendorAddresses;
