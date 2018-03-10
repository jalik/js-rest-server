# Restack

## Introduction

This is a REST API builder based on the excellent [Express](https://expressjs.com/) web server. The main goal is to simplify the creation and modification of those APIs.

**The code is tested against bugs.**

## Creating a server

```js
import RestServer from "restack/dist/rest-server";

// Define the server configuration
const server = new RestServer({
    // Listen on this port
    port: 3001,
    // Automatically restart the server
    // if an API has been added or removed.
    restartOnChange: true,
});

// APIs definition...

server.start();
```

## Creating a REST API

When creating an API, you must at least define a `method`, a `path` and a `callback`.
Note that the callback is an Express handler (see [https://expressjs.com/en/starter/basic-routing.html]()).

```js
import RestAPI from "restack/dist/rest-api";
import RestServer from "restack/dist/rest-server";

// Define the server configuration
const server = new RestServer({
    port: 3001
});

// Add the API to the server
server.addAPI(new RestAPI({
    method: "GET",
    path: "/v1/date",
    callback(request, response) {
        response.status(200).send({
            date: new Date()
        });
    }
}));

server.start();
```

## Adding a middleware

```js
import RestServer from "restack/dist/rest-server";

// Define the server configuration
const server = new RestServer({
    port: 3001
});

// Add a middleware that logs request date, method and URL to the console
server.addMiddleware((req, res, next) => {
    console.log(`${new Date()} ${req.method} ${req.url}`);
    next();
});

// APIs definition...

server.start();
```

## Changelog

### v1.0.0
- First public release

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).
