'use strict';

const needle = require('needle');
const filter = require('../helpers/filter');

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/dogs/:id',
    method: 'GET',
    preValidation: async (request, reply) => {
      /*
      *  takes the inbound authorization headers and sends them via http request to an external auth service
      */
      const result = await needle('get', 'https://jsonplaceholder.typicode.com/todos/1', { headers: { authorization: request.headers.authorization }});

      /*
      *  throw an authentication error based on the response body or statusCode
      */
      if (result.body.error || result.statusCode !== 200) {
        const errorString = result.body.error || 'Sorry, there was an error authenticating your request';
        logger.error(errorString);
        throw new Error(errorString);
      }
    },
    handler: async (request) => {
      request.body= {
        operation: 'sql',
        sql: `SELECT * FROM dev.dogs WHERE id = ${request.params.id}`
      };

      /*
       * requestWithoutAuthentication bypasses the standard HarperDB authentication.
       * YOU MUST ADD YOUR OWN preValidation method above, or this method will be available to anyone.
       */
      const result = await hdbCore.requestWithoutAuthentication(request);

      return filter(result, ['dog_name', 'owner_name', 'breed']);
    }
  })
}
