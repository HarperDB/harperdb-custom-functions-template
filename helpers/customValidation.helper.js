import httpsRequest from './httpsRequest.helper.js';

export default async (request, done, { hdbCore, logger }) => {
	const hostname = `jsonplaceholder.typicode.com`;
	const path = `/todos/1`;
	const { authorization } = request.headers;
	const headers = { authorization };

	try {
		const result = await httpsRequest(hostname, path, headers);
		if (result.error) {
			throw new Error(result.error);
		}
		done();
	} catch (error) {
		const errorMessage =
			error?.response?.data || error.message || 'Sorry, there was an error authenticating your request';
		logger.error(errorMessage);
		throw new Error(errorMessage);
	}
};
