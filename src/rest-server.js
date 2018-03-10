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

import express from "express";
import {extendRecursively} from "@jalik/extend";
import RestAPI from "./rest-api";

class RestServer {

    constructor(options) {
        this.options = extendRecursively({
            port: 3000,
            restartOnChange: true
        }, options);

        // The REST APIs
        this._apis = [];

        // The APIs listing
        this._apiList = {};

        // Create express server
        this._instance = express();

        // The server instance
        this._server = null;
    }

    /**
     * Adds the middleware
     * @param middleware
     */
    addMiddleware(middleware) {
        this._instance.use(middleware);
    }

    /**
     * Adds the REST API
     * @param restApi
     */
    addAPI(restApi) {
        if (!(restApi instanceof RestAPI)) {
            throw new TypeError("Not an instance of RestAPI");
        }
        if (this.apiExists(restApi)) {
            throw new Error("API already exist");
        }

        const method = restApi.getMethod().toLowerCase();

        if (typeof this._instance[method] === "function") {
            this._instance[method](restApi.getPath(), restApi.getCallback());
            this._apis.push(restApi);
            this._apiList = this.generateApiList();

            if (this._server && this.options.restartOnChange) {
                this.restart();
            }
        }
    }

    /**
     * Checks if the REST API exists
     * @param {RestAPI} restApi
     * @return {boolean}
     */
    apiExists(restApi) {
        let exist = false;

        for (let i = 0; i < this._apis.length; i += 1) {
            if (restApi.getPath() === this._apis[i].getPath()
                && restApi.getMethod() === this._apis[i].getMethod()) {
                exist = true;
                break;
            }
        }
        return exist;
    }

    /**
     * Generates the API list
     * @return {object}
     */
    generateApiList() {
        const list = {};

        for (let i = 0; i < this._apis.length; i += 1) {
            const api = this._apis[i];

            if (!list.hasOwnProperty(api.getPath())) {
                list[api.getPath()] = {
                    methods: []
                };
            }
            list[api.getPath()].methods.push(api.getMethod());
        }
        return list;
    }

    /**
     * Returns the API list
     * @return {object}
     */
    getApiList() {
        return this._apiList;
    }

    /**
     * Returns the ExpressJS instance
     * @return {*|Function}
     */
    getInstance() {
        return this._instance;
    }

    /**
     * Returns the server port
     * @return {number}
     */
    getPort() {
        return this.options.port;
    }

    /**
     * Restarts the server
     */
    restart() {
        this.stop();
        this.start();
    }

    /**
     * Starts the server
     */
    start() {
        console.log(`Starting REST server on port ${this.options.port}`);

        // Creates the root API
        const rootAPI = new RestAPI({
            method: "GET",
            path: "/",
            callback: (request, response) => {
                this._instance.set("json spaces", 2);
                response.status(200).send(this.getApiList());
            }
        });

        if (!this.apiExists(rootAPI)) {
            this.addAPI(rootAPI);
        }

        this._server = this._instance.listen(this.options.port);
    }

    /**
     * Stops the server
     */
    stop() {
        if (this._server) {
            console.log(`Stopping REST server on port ${this.options.port}`);
            this._server.close();
        }
    }
}

export default RestServer;
