'use strict';

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/addDog',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: async (request) => hdbCore.request(request)
  })
}

module.exports.autoPrefix = 'v1';
