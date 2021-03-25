'use strict';

const filter = require('../helpers/filter');

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/dogs/:id',
    method: 'GET',
    handler: async (request) => {
      request.body= {
        operation: 'sql',
        sql: `SELECT * FROM dev.dogs WHERE id = ${request.params.id}`
      };

      const result = await hdbCore.requestWithoutAuthentication(request);

      return filter(result, ['dog_name', 'owner_name', 'breed']);
    }
  })
}

module.exports.autoPrefix = 'v1';
