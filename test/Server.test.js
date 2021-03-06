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

import fetch from 'node-fetch';
import Route from '../src/Route';
import Server from '../src/Server';

const testAPI = new Route({
  method: 'GET',
  path: '/test',
  handler(req, res) {
    res.status(200).send('OK');
  },
});

const test2API = new Route({
  method: 'GET',
  path: '/test2',
  handler(req, res) {
    res.status(302).send('FOUND');
  },
});

const server = new Server({
  port: 3001,
});
server.addRoute(testAPI);
const baseUrl = `http://localhost:${server.getPort()}`;

describe('Server', () => {
  afterAll(() => {
    server.stop();
  });

  describe('start()', () => {
    server.start();

    it('should start the server', () => (
      fetch(`${baseUrl}/test`).then((resp) => {
        expect(resp.status).toBe(200);
      })
    ));
  });

  describe('addRoute()', () => {
    server.addRoute(test2API);

    it('should add an API and restart the server', () => (
      fetch(`${baseUrl}/test2`).then((resp) => {
        expect(resp.status).toBe(302);
      })
    ));
  });
});
