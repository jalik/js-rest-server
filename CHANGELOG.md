# Changelog

## 2.0.3
- Upgraded dependencies

## 2.0.2
- Upgraded dependencies

## 2.0.1
- Removed `formatJson` option in `Server` constructor
- Renamed method `getCORS()` to `getCors()` in `Route`
- Added `corsOptions` to `Route` constructor

## 2.0.0
- Removed the 4th argument passed to middleware and route handlers
- Renamed method `getInstance()` to `getExpress()` in `Server`
- Renamed files to match exported object name
- Added `cors` options to `Route` constructor to allow CORS requests
- Removed default logging from `Server`
- Upgraded dependencies

## 1.1.3
- Upgraded dependencies

## 1.1.2
- Upgraded dependencies

## 1.1.1
- Upgraded dependencies
- Added `Route.getDescription()`
- Added option `description` to `Route` constructor

## v1.1.0
- Added better check on `method` option when creating a `Route`
- Added `server` as the 4th argument passed to middleware and route handler
- Added `Server.autoRestart()`
- Added `Server.setPort(Number)`
- Applies the option `formatJson` to all routes using a middleware
- Changed `formatJson` to `true` in `Server` options

## v1.0.0
- First public release
