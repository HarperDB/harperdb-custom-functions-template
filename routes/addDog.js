'use strict';

module.exports = async (server, { hdbCore, logger }) => {
  server.route({
    url: '/addDog',
    method: 'POST',
    handler: (request) => {
      request.body= {
        operation: 'insert',
        schema: 'dev',
        table: 'dogs',
        records: [
          {
            dog_name : 'Penny',
            owner_name: 'Kyle',
            breed_id: 154,
            age: 5,
            weight_lbs: 35,
            adorable: true
          }
        ]
      };
      return hdbCore.request(request);
    }
  })
}

module.exports.autoPrefix = 'v1';
