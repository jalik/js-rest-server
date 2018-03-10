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

import request from "supertest";
import RestAPI from "../src/rest-api";
import RestServer from "../src/rest-server";

describe(`RestServer`, () => {

    const server = new RestServer({
        port: 3001
    });

    afterAll(() => {
        server.stop();
    });

    it(`should be importable from package`, () => {
        expect(typeof RestServer).toEqual("function");
    });

    server.addAPI(new RestAPI({
        method: "GET",
        path: "/date",
        callback(request, response) {
            response.status(200).send({date: new Date()});
        }
    }));

    describe(`start()`, () => {
        server.start();

        it(`should start the server`, (done) => {
            return request(server.getInstance()).get("/date").expect(200, done);
        });
    });

    describe(`addAPI()`, () => {
        server.addAPI(new RestAPI({
            method: "GET",
            path: "/new-api",
            callback(request, response) {
                response.status(200).send({test:"ok"});
            }
        }));

        it(`should add an API`, (done) => {
            return request(server.getInstance()).get("/date").expect(200, done);
        });
    });

    describe(`GET /date`, () => {
        it(`should return a JSON with 200 response`, (done) => {
            return request(server.getInstance()).get("/date").expect(200, done);
        });
    });

    describe(`GET /unknown`, () => {
        it(`should return a 404 response`, (done) => {
            return request(server.getInstance()).get("/unknown").expect(404, done);
        });
    });
});
