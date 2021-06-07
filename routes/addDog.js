'use strict';

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/addDog',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request,
  })
}
