'use strict'

async function cats (server, { hdbApiStream, hdbApiClient, hdbCore }) {
  server.route({
    url: '/cats',
    method: 'GET',
    handler: async (request, response) => {
      // your code here
      // use an hdbCore method: hdbCore.searchByHash('dev', 'dog', [9], ['*'])
      // make a call to the hdbAPI: await hdbApiClient.request({})
      // return using the response object: response.send({ dog1, dog2 })
      response.send({ message: '/cats endpoint has been created' });
    }
  })
}

module.exports = cats;
module.exports.autoPrefix = ''
