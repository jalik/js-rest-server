# @jalik/rest-server

## Introduction

This is a REST API builder based on the excellent [Express](https://expressjs.com/) web server. The main goal is to simplify the creation and modification of those APIs.

**The code is tested against bugs.**

## Creating a REST API

When creating an API, you must at least define a `method`, a `path` and a `handler`.
Note that the handler is an Express handler (see [https://expressjs.com/en/starter/basic-routing.html]()).

Since you may have a lot of APIs, it's recommended to put them in separate files like below.

```js
// ./api/get-date.js
import Route from "@jalik/rest-server/dist/route";

const GetDateAPI = new Route({
    method: "GET",
    path: "/v1/date",
    handler(request, response) {
        response.status(200).send({
            date: new Date()
        });
    }
});
export default GetDateAPI;
```

## Creating a server

To serve the APIs you've created, you need a web server, so let see how to do that.

```js
// ./server.js
import GetDateAPI from "./api/get-date";
import Server from "@jalik/rest-server/dist/server";

// Define the server configuration
const server = new Server({
    // Return formatted JSON
    formatJson: true,
    // Listen on this port
    port: 3001,
    // Automatically restart the server
    // if an API has been added or removed.
    restartOnChange: true,
});

// Add the APIs to the server
server.addRoute(GetDateAPI);

// And finally start the server
server.start();
```

## Adding a middleware

```js
import Server from "@jalik/rest-server/dist/server";

// Define the server configuration
const server = new Server({
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

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).
