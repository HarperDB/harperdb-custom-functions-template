'use strict';

const filter = require('../helpers/filter');

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/dogs/:id',
    method: 'GET',
    onRequest: (request, reply, done) => {
      request.headers.authorization = 'Basic SERCX0FETUlOOnBhc3N3b3Jk';
      request.body= {
        operation: 'sql',
        sql: `SELECT d.*, b.* FROM dev.dogs AS d INNER JOIN dev.breeds AS b ON d.breed_id = b.id WHERE d.id = ${request.params.id} ORDER BY d.dog_name`
      };
      done();
    },
    preValidation: hdbCore.preValidation,
    handler: async (request) => {
      const result = await hdbCore.request(request);
      return filter(result);
    }
  })
}

module.exports.autoPrefix = 'v1';
