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
import Logger from "@jalik/logger";
import Observer from "@jalik/observer";
import Route from "./route";
import {extendRecursively} from "@jalik/extend";

class Server {

    constructor(options) {
        this.options = extendRecursively({
            formatJson: false,
            port: 3000,
            restartOnChange: true
        }, options);

        // Create express server
        this._instance = express();

        // Create logger
        this._logger = new Logger();

        // Create the observer
        this._observer = new Observer(this);

        // The server routes
        this._routes = [];

        // The route listing
        this._routeList = {};

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
     * @param route
     */
    addRoute(route) {
        if (!(route instanceof Route)) {
            throw new TypeError("Not an instance of Route");
        }
        if (this.routeExists(route.getMethod(), route.getPath())) {
            throw new Error("Route already exist");
        }

        const method = route.getMethod().toLowerCase();

        if (typeof this._instance[method] === "function") {
            this._instance[method](route.getPath(), route.getHandler());
            this._routes.push(route);
            this._routeList = this.generateRouteList();

            // Restart server automatically
            if (this._server && this.options.restartOnChange) {
                this.restart();
            }
        }
    }

    /**
     * Checks if the route exists
     * @param {string} method
     * @param {string} path
     * @return {boolean}
     */
    routeExists(method, path) {
        let exist = false;

        for (let i = 0; i < this._routes.length; i += 1) {
            if (path === this._routes[i].getPath() && method === this._routes[i].getMethod()) {
                exist = true;
                break;
            }
        }
        return exist;
    }

    /**
     * Generates the route list
     * @return {object}
     */
    generateRouteList() {
        const list = {};

        for (let i = 0; i < this._routes.length; i += 1) {
            const api = this._routes[i];

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
     * Returns the route list
     * @return {object}
     */
    getRouteList() {
        return this._routeList;
    }

    /**
     * Returns the Express instance
     * @return {*|Function}
     */
    getInstance() {
        return this._instance;
    }

    /**
     * Returns the logger
     * @return {Logger}
     */
    getLogger() {
        return this._logger;
    }

    /**
     * Returns the server port
     * @return {number}
     */
    getPort() {
        return this.options.port;
    }

    /**
     * Removes an event listener
     * @param event
     * @param callback
     */
    off(event, callback) {
        this._observer.detach(event, callback);
    }

    /**
     * Adds an event listener
     * @param event
     * @param callback
     */
    on(event, callback) {
        this._observer.attach(event, callback);
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
        this._logger.info(`Starting REST server on port ${this.options.port}`);

        // Creates the root API
        const rootAPI = new Route({
            method: "GET",
            path: "/",
            handler: (request, response) => {
                if (this.options.formatJson) {
                    this._instance.set("json spaces", 2);
                }
                response.status(200).send(this.getRouteList());
            }
        });

        // Add the root path
        if (!this.routeExists(rootAPI.getMethod(), rootAPI.getPath())) {
            this.addRoute(rootAPI);
        }

        this._server = this._instance.listen(this.options.port);
    }

    /**
     * Stops the server
     */
    stop() {
        if (this._server) {
            this._logger.info(`Stopping REST server on port ${this.options.port}`);
            this._server.close();
        }
    }
}

export default Server;
