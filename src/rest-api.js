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

import {extendRecursively} from "@jalik/extend/dist/index";

class RestAPI {

    constructor(options) {
        this.options = extendRecursively({}, options);

        if (typeof options.method !== "string") {
            throw new Error("API method is not valid");
        }
        if (typeof options.path !== "string") {
            throw new Error("API path is not valid");
        }
        if (!/^\//.test(options.path)) {
            throw new Error(`API path "${options.path}" must start with a slash "/"`);
        }

        // The API callback
        this._callback = options.callback;

        // The API method
        this._method = options.method.toUpperCase();

        // The API path
        this._path = options.path;
    }

    getCallback() {
        return this._callback;
    }

    getMethod() {
        return this._method;
    }

    getPath() {
        return this._path;
    }
}

export default RestAPI;
