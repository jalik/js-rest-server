/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
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

const httpMethods = [
  'CONNECT',
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
  'TRACE',
];

class Route {
  constructor(options) {
    this.options = extend({
      cors: false,
      corsOptions: {
        allowedHeaders: undefined,
        credentials: undefined,
        exposedHeaders: undefined,
        maxAge: undefined,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        optionsSuccessStatus: 204,
        origin: '*',
        preflightContinue: false,
      },
      description: null,
      method: null,
      path: null,
    }, options);

    // Check options
    if (typeof options.method !== 'string' || httpMethods.indexOf(options.method.toUpperCase()) === -1) {
      throw new Error(`Route method must be one of ${httpMethods}`);
    }
    if (typeof options.path !== 'string') {
      throw new Error('Route path is not valid');
    }
    if (!/^\//.test(options.path)) {
      throw new Error(`Route path "${options.path}" must start with a slash "/"`);
    }

    // Enable CORS.
    this.cors = options.cors;
    this.corsOptions = options.corsOptions;

    // Route description
    this.description = options.description;

    // Route handler
    this.handler = options.handler;

    // Route method
    this.method = options.method.toUpperCase();

    // Route path
    this.path = options.path;
  }

  /**
   * Checks if CORS is enabled.
   * @return {boolean|any}
   */
  getCors() {
    return this.cors;
  }

  /**
   * Returns CORS options.
   * @return {*}
   */
  getCorsOptions() {
    return this.corsOptions;
  }

  /**
   * Returns the route description
   * @return {string}
   */
  getDescription() {
    return this.description;
  }

  /**
   * Returns the route handler
   * @return {function}
   */
  getHandler() {
    return this.handler;
  }

  /**
   * Returns the route method
   * @return {string}
   */
  getMethod() {
    return this.method;
  }

  /**
   * Returns the route path
   * @return {string}
   */
  getPath() {
    return this.path;
  }
}

export default Route;
