'use strict';

const customValidation = require('../helpers/example');

// eslint-disable-next-line no-unused-vars,require-await
module.exports = async (server, { hdbCore, logger }) => {

  // POST, WITH STANDARD PASS-THROUGH BODY, PAYLOAD AND HDB AUTHENTICATION
  // THIS IS THE SAME AS HITTING THE OPERATIONS API, BUT AT YOUR OWN ENDPOINT
  server.route({
    url: '/',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request,
  });

  // GET, USING hdbCore.preValidation AND hdbCore.request
  // CRAFTING A CUSTOM REQUEST IN THE onRequest HANDLER
  server.route({
    url: '/onRequest',
    method: 'GET',
    onRequest: (request, reply, done) => {
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM dev.dog ORDER BY dog_name'
      };
      done();
    },
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request
  });

  // GET, USING hdbCore.preValidation AND hdbCore.request
  // CRAFTING A CUSTOM REQUEST IN THE preParsing HANDLER
  // WITH ACCESS TO request.body (not present in the onRequest handler)
  server.route({
    url: '/preParsing/:id',
    method: 'GET',
    preParsing: (request, response, done) => {
      request.body = {
        ...request.body,
        operation: 'sql',
        sql: `SELECT * FROM dev.dog WHERE id = ${request.params.id}`
      };
      done();
    },
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request,
  });

  // GET, WITH NO preValidation AND USING hdbCore.requestWithoutAuthentication
  // BYPASSES ALL CHECKS: DO NOT USE RAW USER-SUBMITTED VALUES IN SQL STATEMENTS
  server.route({
    url: '/',
    method: 'GET',
    onRequest: (request, reply, done) => {
      request.body = {
        operation: 'sql',
        sql: 'SELECT * FROM dev.dog'
      };
      done();
    },
    handler: (request) => hdbCore.requestWithoutAuthentication(request)
  });

  // GET, WITH ASYNC THIRD-PARTY AUTH PREVALIDATION
  // (IMPORTED FROM ../helpers/example)
  // BYPASSES ALL CHECKS: DO NOT USE RAW USER-SUBMITTED VALUES IN SQL STATEMENTS
  server.route({
    url: '/async-verify/:id',
    method: 'GET',
    preValidation: (request) => customValidation(request, logger),
    handler: (request) => {
      request.body= {
        operation: 'sql',
        sql: `SELECT * FROM dev.dog WHERE id = ${request.params.id}`
      };
      return hdbCore.requestWithoutAuthentication(request);
    }
  });
};
