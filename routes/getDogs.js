'use strict';

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/dogs',
    method: 'GET',
    handler: (request) => {
      request.body= {
        operation: 'sql',
        sql: 'SELECT * FROM dev.dogs ORDER BY dog_name'
      };
      return hdbCore.requestWithoutAuthentication(request);
    }
  })
}

module.exports.autoPrefix = 'v1';
