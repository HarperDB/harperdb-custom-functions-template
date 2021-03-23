'use strict'
const _ = require('lodash');

async function dogs (server, { hdbCore, logger }) {
  server.route({
    url: '/getDogs',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: async (request, response) => {
      const dogs = await hdbCore.request(request);
      logger.notify(dogs);
      const mapped = _.map(dogs, _.partialRight(_.pick, ['dog_name', 'owner_name']));
      return mapped;
    }
  })
  server.route({
    url: '/insertDog',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: async (request, response) => hdbCore.request(request)
  })
}

module.exports = dogs;
module.exports.autoPrefix = ''
