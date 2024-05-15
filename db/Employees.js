// ./db/Employees.js

const { Model } = require('nap-db');

class Employees extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'employees',
      columns: {
        id: { type: 'serial', primaryKey: true },
        first_name: { type: 'varchar(255)' },
        last_name: { type: 'varchar(255)' },
        email: { type: 'varchar(255)' },
        phone_number: { type: 'varchar(20)', nullable: true },
        tax_id: { type: 'varchar(50)', nullable: true },
        is_user: { type: 'boolean', default: false },
        archived: { type: 'boolean', default: false },
      },
    });
  }
}

module.exports = Employees;
