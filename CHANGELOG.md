# Changelog

## 2.0.2
- Upgrades dependencies

## 2.0.1
- Removes `formatJson` option in `Server` constructor
- Renames method `getCORS()` to `getCors()` in `Route`
- Adds `corsOptions` to `Route` constructor

## 2.0.0
- Removes the 4th argument passed to middleware and route handlers
- Renames method `getInstance()` to `getExpress()` in `Server`
- Renames files to match exported object name
- Adds `cors` options to `Route` constructor to allow CORS requests
- Removes default logging from `Server`
- Upgrades dependencies

## 1.1.3
- Upgrades dependencies

## 1.1.2
- Upgrades dependencies

## 1.1.1
- Upgrades dependencies
- Adds `Route.getDescription()`
- Adds option `description` to `Route` constructor

## v1.1.0
- Adds better check on `method` option when creating a `Route`
- Adds `server` as the 4th argument passed to middleware and route handler
- Adds `Server.autoRestart()`
- Adds `Server.setPort(Number)`
- Applies the option `formatJson` to all routes using a middleware
- Changes `formatJson` to `true` in `Server` options

## v1.0.0
- First public release
