'/snippet.js';

/**
 *
 * Copyright © 2024-present, Ian Silverstone
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

// .db/Model.js
'use strict';

/**
 * Model class for creating, reading, updating, and deleting records in a database table.
 * @class Model - Base class for managing CRUD and other database operations
 * @constructor
 */
class Model {
  // static csCounter = 0;
  /**
   * Creates an instance of Model.
   * @param {Object} db - The database connection object
   * @param {Object} pgp - The pg-promise instance
   * @param {TableSchema} schema - The schema object
   * @throws {DBError} - If the db, pgp, or schema parameters are invalid
   * @memberof Model
   * @constructor
   */
  constructor(schema) {
    try {
      if (!schema || !schema.tableName || !schema.columns) {
        const message = !schema
          ? 'Invalid schema.'
          : !schema.tableName
          ? 'Table name must be defined.'
          : 'Schema requires at least one columns.';

        throw new Error(message);
      }

      if (!schema.dbSchema) schema.dbSchema = 'public';
      if (!schema.timeStamps) schema.timeStamps = true;
      this.schema = JSON.parse(JSON.stringify(schema));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Creates the SQL query to create the table based on the schema provided
   * @memberof Model
   * @returns {string} - The SQL query to create the table
   * @throws {DBError} - If the table creation query fails
   */
  createTableQuery() {
    let columns = Object.entries(this.schema.columns)
      .map(([name, config]) => {
        let column = `${name} ${config.type}`;
        if (config.primaryKey) {
          column += ' PRIMARY KEY';
        }
        if (!config.nullable) {
          column += ' NOT NULL';
        }
        if (config.hasOwnProperty('default')) {
          column += ` DEFAULT ${config.default}`;
        }
        return column;
      })
      .join(',\n');

    if (this.schema.timeStamps) {
      columns += `,\ncreated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,\ncreated_by varchar(50) NOT NULL,\nupdated_at timestamptz NULL DEFAULT NULL,\nupdated_by varchar(50) NULL DEFAULT NULL`;
    }

    const foreignKeys = this.schema.foreignKeys
      ? Object.entries(this.schema.foreignKeys)
          .map(([name, config]) => {
            return `FOREIGN KEY (${name}) REFERENCES ${
              config.referenceTable
            }(${config.referenceColumns.join(',')}) ON DELETE ${
              config.onDelete
            } ON UPDATE ${config.onUpdate}`;
          })
          .join(',\n')
      : '';

    const constraints = this.schema.constraints
      ? Object.entries(this.schema.constraints)
          .map(([name, config]) => {
            return `CONSTRAINT ${name} ${config}`;
          })
          .join(',\n')
      : '';

    const uniqueConstraints = this.schema.uniqueConstraints
      ? Object.entries(this.schema.uniqueConstraints)
          .map(([name, config]) => {
            const columns = config.columns.join(',');
            return `CONSTRAINT ${name} UNIQUE (${columns})`;
          })
          .join(',\n')
      : '';

    return `CREATE TABLE IF NOT EXISTS ${this.schema.tableName} (\n${columns}${
      foreignKeys ? ',\n' + foreignKeys : ''
    }${constraints ? ',\n' + constraints : ''}${
      uniqueConstraints ? ',\n' + uniqueConstraints : ''
    }\n);`;
  }
}

class Addresses extends Model {
  constructor() {
    super({
      tableName: 'addresses',
      columns: {
        id: { type: 'uuid', primaryKey: true, default: 'uuid_generate_v4()' },
        owner_id: { type: 'uuid' },
        owner_type: { type: 'varchar(50)' },
        description: { type: 'varchar(25)' },
        address: { type: 'varchar(255)' },
      },
      constraints: {
        chk_owner_type: "owner_type IN ('employee', 'vendor')",
        fk_owner_id_employee_id:
          'FOREIGN KEY (owner_id) REFERENCES employees(id) ON DELETE CASCADE',
        fk_owner_id_vendor_id:
          'FOREIGN KEY (owner_id) REFERENCES vendors(id) ON DELETE CASCADE',
      },
    });
  }
}

console.log('hello');

const addresses = new Addresses();
console.log(addresses.createTableQuery());
