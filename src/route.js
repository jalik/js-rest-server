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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {extendRecursively as extend} from "@jalik/extend";

const httpMethods = [
    "CONNECT",
    "DELETE",
    "GET",
    "HEAD",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
    "TRACE",
];

class Route {

    constructor(options) {
        // Default options
        this.options = extend({
            description: null,
            method: null,
            path: null,
        }, options);

        // Check options
        if (typeof options.method !== "string" || httpMethods.indexOf(options.method.toUpperCase()) === -1) {
            throw new Error(`Route method must be one of ${httpMethods}`);
        }
        if (typeof options.path !== "string") {
            throw new Error("Route path is not valid");
        }
        if (!/^\//.test(options.path)) {
            throw new Error(`Route path "${options.path}" must start with a slash "/"`);
        }

        // The route description
        this._description = options.description;

        // The route handler
        this._handler = options.handler;

        // The route method
        this._method = options.method.toUpperCase();

        // The route path
        this._path = options.path;
    }

    /**
     * Returns the route description
     * @return {string}
     */
    getDescription() {
        return this._description;
    }

    /**
     * Returns the route handler
     * @return {function}
     */
    getHandler() {
        return this._handler;
    }

    /**
     * Returns the route method
     * @return {string}
     */
    getMethod() {
        return this._method;
    }

    /**
     * Returns the route path
     * @return {string}
     */
    getPath() {
        return this._path;
    }
}

export default Route;
