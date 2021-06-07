# HarperDB Custom Functions Demo

 This demo comprises a set of Fastify routes to be loaded by HarperDB's Custom Functions Fastify Server.

To deploy these routes, simply clone this repo into your `custom_functions` folder. By default, this folder is located in your HarperDB user folder `(~/hdb)`.

##Routes

---

###/addDog 
FILE: /routes/addDog.js

This route ***passes through*** HarperDB's standard authentication. You'll need to include an appropriately authorized users Basic auth token in your request, which this route will then authenticate like any request to the standard HarperDB Operation API.

```
server.route({
    url: '/addDog',
    method: 'POST',
    preValidation: hdbCore.preValidation,
    handler: hdbCore.request,
  })
```

###/getDogs
FILE: /routes/getDogs.js

This route ***passes through*** HarperDB's standard authentication. You'll need to include an appropriately authorized users Basic auth token in your request, which this route will then authenticate like any request to the standard HarperDB Operation API.

```
server.route({
    url: '/dogs',
    method: 'GET',
    handler: (request) => {
      request.body= {
        operation: 'sql',
        sql: 'SELECT * FROM dev.dogs ORDER BY dog_name'
      };
      return hdbCore.requestWithoutAuthentication(request);
    }
  })
```

###/getDogById/:id
FILE: /routes/getDogById.js

This route ***bypasses*** HarperDB's standard authentication. You'll you'll want to include your own, OR ANY USER WILL BE ABLE TO ACCESS THIS REQUEST.


```
  server.route({
    url: '/dogs/:id',
    method: 'GET',
    preValidation: async (request, reply) => {
      /*
      *  takes the inbound authorization headers and sends them via http request to an external auth service
      */
      const result = await needle('get', 'https://jsonplaceholder.typicode.com/todos/1', { headers: { authorization: request.headers.authorization }});

      /*
      *  throw an authentication error based on the response body or statusCode
      */
      if (result.body.error || result.statusCode !== 200) {
        const errorString = result.body.error || 'Sorry, there was an error authenticating your request';
        logger.error(errorString);
        throw new Error(errorString);
      }
    },
    handler: async (request) => {
      request.body= {
        operation: 'sql',
        sql: `SELECT * FROM dev.dogs WHERE id = ${request.params.id}`
      };

      /*
      * requestWithoutAuthentication bypasses the standard HarperDB authentication.
      * YOU MUST ADD YOUR OWN preValidation method above, or this method will be available to anyone.
      */
      const result = await hdbCore.requestWithoutAuthentication(request);

      return filter(result, ['dog_name', 'owner_name', 'breed']);
    }
  })
```



