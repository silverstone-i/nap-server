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
        employee_id: { type: 'uuid', nullable: true, default: null },
        vendor_id: { type: 'uuid', nullable: true, default: null },
        customer_id: { type: 'uuid', nullable: true, default: null },
        stakeholder_type: { type: 'varchar(20)' },
        location: { type: 'varchar(25)' },
        address: { type: 'varchar(255)' },
      },
      constraints: {
        ch_stakeholder_type:
          "CHECK (stakeholder_type IN ('employee', 'vendor', 'customer'))",
        fk_employee_id: 'FOREIGN KEY (employee_id) REFERENCES employees(id)',
        fk_vendor_id: 'FOREIGN KEY (vendor_id) REFERENCES vendors(id)',
        fk_customer_id: 'FOREIGN KEY (customer_id) REFERENCES customers(id)',
      },
    });
  }

  async insertReturning(dto) {
    try {
      const returning = 'RETURNING id';
      delete dto.returning;
      const inputValuesArray = this.createInputValuesArray(dto);

      const query =
        this.pgp.helpers.insert(inputValuesArray, this.cs.insert) +
        ' ' +
        returning;

      const addresses = await this.db.many(query);
      return addresses;
    } catch (error) {
      console.error('Error inserting record:', error.message, error.stack);
      throw new Error('Error inserting new address:', error.message);
    }
  }

  createInputValuesArray(dto) {
    return dto.address.map((addr) => {
      const location = Object.keys(addr)[0];
      const valuesArray = {
        stakeholder_type: dto.stakeholder_type,
        location: location,
        address: addr[location],
        created_by: dto.created_by,
      };

      if (dto.employee_id) {
        valuesArray.employee_id = dto.employee_id;
      } else if (dto.vendor_id) {
        valuesArray.vendor_id = dto.vendor_id;
      } else if (dto.customer_id) {
        valuesArray.customer_id = dto.customer_id;
      }

      return valuesArray;
    });
  }
}

module.exports = Addresses;
