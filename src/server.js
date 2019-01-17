/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import extend from '@jalik/extend';
import Logger from '@jalik/logger';
import Observer from '@jalik/observer';
import express from 'express';
import RootAPI from './apis/root-api';
import Route from './route';

class Server {
  constructor(options) {
    this.options = extend({
      formatJson: true,
      port: 3000,
      restartOnChange: true,
    }, options);

    // Create express server
    this.instance = express();

    // Create logger
    this.logger = new Logger();

    // Create the observer
    this.observer = new Observer(this);

    // The server routes
    this.routes = [];

    // The route listing
    this.routeList = {};

    // The server instance
    this.server = null;

    this.addMiddleware((req, res, next, server) => {
      try {
        // Format JSON output
        if (server.options.formatJson) {
          server.instance.set('json spaces', 2);
        }
        // Add server logger as a middleware
        server.logger.info(`${req.method} ${req.url}`);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e.message);
      }
      next();
    });
  }

  /**
   * Adds the middleware
   * @param {function} middleware
   */
  addMiddleware(middleware) {
    if (typeof middleware !== 'function') {
      throw new TypeError('middleware must be a function');
    }
    // Wrap middleware to pass server as the context
    this.instance.use((req, res, next) => {
      middleware(req, res, next, this);
    });
  }

  /**
   * Adds the REST API
   * @param {Route} route
   */
  addRoute(route) {
    if (!(route instanceof Route)) {
      throw new TypeError('Not an instance of Route');
    }
    if (this.routeExists(route.getMethod(), route.getPath())) {
      throw new Error('Route already exist');
    }

    const method = route.getMethod().toLowerCase();

    if (typeof this.instance[method] === 'function') {
      this.instance[method](route.getPath(), (req, res, next) => {
        route.getHandler()(req, res, next, this);
      });
      this.routes.push(route);
      this.routeList = this.generateRouteList();

      // Restart server automatically
      this.autoRestart();
    }
  }

  /**
   * Restarts the server automatically
   */
  autoRestart() {
    if (this.server && this.options.restartOnChange) {
      this.restart();
    }
  }

  /**
   * Generates the route list
   * @return {object}
   */
  generateRouteList() {
    const list = {};

    for (let i = 0; i < this.routes.length; i += 1) {
      const route = this.routes[i];
      const routePath = route.getPath();
      const routeMethod = route.getMethod();

      if (typeof list[routePath] === 'undefined') {
        list[routePath] = {
          methods: {},
        };
      }

      // Create route details
      list[routePath].methods[routeMethod] = {
        description: route.getDescription(),
      };
    }
    return list;
  }

  /**
   * Returns the Express instance
   * @return {*|Function}
   */
  getInstance() {
    return this.instance;
  }

  /**
   * Returns the logger
   * @return {Logger}
   */
  getLogger() {
    return this.logger;
  }

  /**
   * Returns the server port
   * @return {number}
   */
  getPort() {
    return this.options.port;
  }

  /**
   * Returns the route list
   * @return {object}
   */
  getRouteList() {
    return this.routeList;
  }

  /**
   * Removes an event listener
   * @param event
   * @param callback
   */
  off(event, callback) {
    this.observer.detach(event, callback);
  }

  /**
   * Adds an event listener
   * @param event
   * @param callback
   */
  on(event, callback) {
    this.observer.attach(event, callback);
  }

  /**
   * Restarts the server
   */
  restart() {
    this.stop();
    this.start();
  }

  /**
   * Checks if the route exists
   * @param {string} method
   * @param {string} path
   * @return {boolean}
   */
  routeExists(method, path) {
    let exist = false;

    for (let i = 0; i < this.routes.length; i += 1) {
      if (path === this.routes[i].getPath() && method === this.routes[i].getMethod()) {
        exist = true;
        break;
      }
    }
    return exist;
  }

  /**
   * Sets the server port
   * @param {number} port
   */
  setPort(port) {
    if (typeof port !== 'number') {
      throw new TypeError('Server port must be a number');
    }
    this.options.port = Math.round(port);
    this.autoRestart();
  }

  /**
   * Starts the server
   */
  start() {
    // Add the root path
    if (!this.routeExists(RootAPI.getMethod(), RootAPI.getPath())) {
      this.addRoute(RootAPI);
    }

    // Listen request on defined port
    this.server = this.instance.listen(this.options.port);
    this.logger.info(`Started REST server on port ${this.options.port}`);
  }

  /**
   * Stops the server
   */
  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
      this.logger.info(`Stopped REST server on port ${this.options.port}`);
    }
  }
}

export default Server;
