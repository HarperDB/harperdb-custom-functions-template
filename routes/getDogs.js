'use strict';

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/dogs',
    method: 'GET',
    onRequest: (request, reply, done) => {
      request.headers.authorization = 'Basic SERCX0FETUlOOnBhc3N3b3Jk';
      request.body= {
        operation: "sql",
        sql: "SELECT d.*, b.* FROM dev.dogs AS d INNER JOIN dev.breeds AS b ON d.breed_id = b.id WHERE d.owner_name IN ('Kyle', 'Zach', 'Stephen') AND b.section = 'Mutt' ORDER BY d.dog_name"
      };
      done();
    },
    preValidation: hdbCore.preValidation,
    handler: async (request) => hdbCore.request(request)
  })
}

module.exports.autoPrefix = 'v1';
