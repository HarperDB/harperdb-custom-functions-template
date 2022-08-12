import customValidation from '../helpers/customValidation.helper.js';

export default async (server, { hdbCore, logger }) => {
	/**
	 * GET request that bypasses all checks
	 * No Prevalidation
	 * Uses hdbCore.requestWithoutAuthentication
	 * ------------------------------------------------------
	 * DO NOT USE RAW USER-SUBMITTED VALUES IN SQL STATEMENTS
	 * ------------------------------------------------------
	 */
	server.route({
		url: '/',
		method: 'GET',
		handler: () => {
			const body = {
				operation: 'sql',
				sql: 'SELECT * FROM dev.dogs ORDER BY dog_name',
			};
			return hdbCore.requestWithoutAuthentication({ body });
		},
	});

	/**
	 * POST requst with standard pass-through body, payload, and HDB authentication
	 */
	server.route({
		url: '/',
		method: 'POST',
		preValidation: hdbCore.preValidation,
		handler: hdbCore.request,
	});

	/**
	 * GET request with the operation set in the preParsing handler
	 * This allows you to define the operations server-side
	 * while also being able to preValidate the header auth
	 * against the operation
	 */
	server.route({
		url: '/:id',
		method: 'GET',
		preParsing: (request, response, done) => {
			request.body = {
				...request.body,
				operation: 'sql',
				sql: `SELECT * FROM dev.dogs WHERE id = ${request.params.id}`,
			};
			done();
		},
		preValidation: hdbCore.preValidation,
		handler: hdbCore.request,
	});

	/**
	 * GET request with a custom preValidaiton authentication handler
	 * imported from ../helpers/customValidation.helper.mjs
	 */
	server.route({
		url: '/async-verify/:id',
		method: 'GET',
		preValidation: (request, replay, done) => customValidation(request, done, { hdbCore, logger }),
		handler: (request) => {
			const body = {
				operation: 'sql',
				sql: `SELECT * FROM dev.dogs WHERE id = ${request.params.id}`,
			};

			/**
			 * requestWithoutAuthentication bypasses the standard HarperDB authentication.
			 * YOU MUST ADD YOUR OWN preValidation method above, or this method will be available to anyone.
			 */
			return hdbCore.requestWithoutAuthentication({ body });
		},
	});
};
