# @jalik/rest-server

![GitHub package.json version](https://img.shields.io/github/package-json/v/jalik/js-rest-server.svg)
[![Build Status](https://travis-ci.com/jalik/js-rest-server.svg?branch=master)](https://travis-ci.com/jalik/js-rest-server)
![GitHub](https://img.shields.io/github/license/jalik/js-rest-server.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/jalik/js-rest-server.svg)
[![GitHub issues](https://img.shields.io/github/issues/jalik/js-rest-server.svg)](https://github.com/jalik/js-rest-server/issues)
![npm](https://img.shields.io/npm/dt/@jalik/rest-server.svg)

## Introduction

This is a REST API server based on the excellent [Express](https://expressjs.com/) web server.
The main goal is to simplify the management of any APIs.
Note that this server is independent and cannot work as a middleware in an existing express application, it needs to run on a dedicated port.

## Why using this ?

- The express server restarts automatically whenever a route is added or removed, or if the port changes
- It allows to create routes objects which can be used to generate API documentation

## Creating a REST API

When creating an API, you must at least define a `method`, a `path` and a `handler`.
Note that the handler is an Express handler (see [https://expressjs.com/en/starter/basic-routing.html]()).

Since you may have a lot of APIs, it's recommended to put them in separate files like below.

```js
import { Route } from '@jalik/rest-server';

const GetDateAPI = new Route({
  cors: false,
  method: 'GET',
  path: '/v1/date',
  handler(req, resp) {
    resp.status(200).end(JSON.stringify({ 
      date: new Date().toISOString()
    }));
  }
});

export default GetDateAPI;
```

## Creating a server

To serve the APIs you've created, you need a web server, so let see how to do that.

```js
import Server from '@jalik/rest-server';

// Setup server
const server = new Server({
  port: 3001,
  // Automatically restart the server
  // if an API has been added or removed.
  restartOnChange: true,
});

// Add routes
// ... server.addRoute(route);
// ... server.addRoute(route);

// Finally start the server
server.start();
```

## Adding a middleware

```js
import Server from '@jalik/rest-server';

// Setup server
const server = new Server({
  port: 3001
});

// Log request date, method and URL to the console
server.addMiddleware((req, resp, next) => {
  console.log(`${new Date()} ${req.method} ${req.url}`);
  next();
});

server.start();
```

## Changelog

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).
