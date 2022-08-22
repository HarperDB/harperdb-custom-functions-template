import https from 'https';

export default (hostname, path, headers) => {
	const options = {
		hostname,
		port: 443,
		path,
		method: 'GET',
		headers,
	};

	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			res.setEncoding('utf8');
			let responseBody = '';

			res.on('data', (chunk) => {
				responseBody += chunk;
			});

			res.on('end', () => {
				resolve(JSON.parse(responseBody));
			});
		});

		req.on('error', (err) => {
			reject(err);
		});

		req.end();
	});
};
