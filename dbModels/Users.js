'./dbModels/Users.js'

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
const bcrypt = require('bcrypt');
require('dotenv').config();


class Users extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'users',
      columns: {
        id: { type: 'uuid', primaryKey: true, default: 'uuid_generate_v4()' },
        email: { type: 'varchar(255)' },
        password: { type: 'varchar(100)' },
        role: { type: 'varchar(50)', nullable: true },
        employee_id: { type: 'uuid', nullable: true },
        archived: { type: 'boolean', default: false },
      },
      foreignKeys: {
        employee_id: {
          referenceTable: 'employees',
          referenceColumns: ['id'],
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      },
      uniqueConstraints: {
        users_email: { columns: ['email'] },
      },
    });
  }

  async login(email) {
    try {
      let qLogin = `SELECT * FROM login WHERE email = '${email}' AND archived = false;`;
      console.log('LOGIN', qLogin);
      const user = await this.db.oneOrNone(qLogin);
      return user;
    } catch (error) {
      console.error('Error logging in user:', error.message, error.stack);
      throw new Error(error.message);
    }
  }

  async registerUser(dto) {
    try {
      const salt = +process.env.SALT_ROUNDS;
      dto.password = await bcrypt.hash(dto.password, salt);

      return await this.insert(dto);
    } catch (error) {
      console.error('Error registering user:', error.message, error.stack);
      throw new Error(error.message);
    }
  }

  print() {
    console.log('SALT_ROUNDS', process.env.SALT_ROUNDS);
  }
}



module.exports = Users;
