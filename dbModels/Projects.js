'./dbModels/Projects.js'

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

class Projects extends Model {
  constructor(db, pgp) {
    super(db, pgp, {
      tableName: 'projects',
      columns: {
        id: { type: 'uuid', primaryKey: true, default:'uuid_generate_v4()' },
        name: { type: 'varchar(255)' },
        description: { type: 'text' },
      }});
  }
}

module.exports = Projects;
