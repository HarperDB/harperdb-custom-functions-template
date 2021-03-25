'use strict';

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/dogs',
    method: 'GET',
    handler: (request) => {
      request.body= {
        operation: 'search_by_value',
        schema: 'dev',
        table: 'dogs',
        search_attribute: 'breed',
        search_value: 'Mu*',
        get_attributes: ['*']
      };
      return hdbCore.request(request);
    }
  })
}

module.exports.autoPrefix = 'v1';
