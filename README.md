# HarperDB Custom Functions Template

This repo comprises a set of Fastify routes, helpers, and static content to be loaded by HarperDB's Custom Functions Fastify Server.

To deploy this template, simply clone this repo into your `custom_functions` folder. By default, this folder is located in your HarperDB user folder `(~/hdb)`.

**Routes are automatically prefixed with their parent folder name.**
For example, if this was cloned into `~/hdb/custom_functions/cf-example` then the url for the `/` GET would be [$HOST:9926/cf-example/]($HOST:9926/cf-example/).

## Routes

---

### GET /

This route uses NO preValidation and requestWithoutAuthentication which BYPASSES ALL CHECKS.

**Remember:** DO NOT USE RAW USER-SUBMITTED VALUES IN SQL STATEMENTS

```
server.route({
  url: "/",
  method: "GET",
  handler: () => {
    const body = {
      operation: "sql",
      sql: "SELECT * FROM dev.dogs ORDER BY dog_name",
    };
    return hdbCore.requestWithoutAuthentication({ body });
  },
});
```

### POST /

A standard request with a pass-through body, payload, and HDB authentication.

```
server.route({
  url: '/',
  method: 'POST',
  preValidation: hdbCore.preValidation,
  handler: hdbCore.request,
})
```

#### Insert Data with cURL POST to /

```
curl -X POST http://localhost:9926/cf-example/ \
  -H 'Authorization: Basic aGRiY2Y6aGRiY2Y=' \
  -H 'Content-Type: application/json' \
  -d '{"operation":"insert","schema":"dev","table":"dogs","records":[{"id":1, "dog_name": "barker"}]}'
```

### GET /:id

A request using preParsing and a url param for the document id.
The preParsing handler allos you to define the operations server-side while also being able to preValidate the header authentcation against that operation.

```
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
```

### GET /async-verify/:id

A request which uses a customValidaiton helper to perform the preValidation actions.

```
server.route({
  url: '/async-verify/:id',
  method: 'GET',
  preValidation: (request) => customValidation(request, { hdbCore, logger }),
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
```

## Helpers

---

The async third-party validation used in the above route:

```
import httpsRequest from './httpsRequest.helper.mjs';

export default async (request, { hdbCore, logger }) => {
  const hostname = `jsonplaceholder.typicode.com`;
  const path = `/todos/1`;
  const { authorization } = request.headers;
  const headers = { authorization };

  try {
    const result = await httpsRequest(hostname, path, headers);
    if (result.error) {
      throw new Error(result.error);
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data ||
      error.message ||
      'Sorry, there was an error authenticating your request';
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
};
```

The httpsRequest used in the above customValidation handler:

```
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
      let responseBody = ';

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
```

## Static Files (Web UI)

---

By adding a `/static` folder to your project, you can also host static files. You might, for example, create a dashboard that displays summary data based on standard HarperDB operations or Custom Functions that pull data from HarperDB.

- **Your static folder MUST contain an `index.html` file**
- **You must use absolute paths for assets (start with a slash)**

---

INDEX.HTML

```
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/resources/img/favicon.png" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>HarperDB Custom Functions Static Template</title>
  <link href="/resources/css/style.css" rel="stylesheet">
</head>
<body>
  <div id="app">
    <div id="app-content">
      <img width="64" height="64" src="/resources/img/logo.png" /><br /><br />
      <b>HarperDB Custom Functions Static Template</b><br /><br />
      Edit or replace this file to create and host your own custom UI.
    </div>
    <div id="app-bg-color" />
    <div id="app-bg-dots" />
  </div>
</body>
</html>
```
