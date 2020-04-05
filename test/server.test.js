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

import request from 'supertest';
import Route from '../src/route';
import Server from '../src/server';

describe('RestServer', () => {
  const server = new Server({
    port: 3001,
  });

  afterAll(() => {
    server.stop();
  });

  it('should be importable from package', () => {
    expect(typeof Server).toEqual('function');
  });

  server.addRoute(new Route({
    method: 'GET',
    path: '/date',
    handler(req, res) {
      res.status(200).send({ date: new Date() });
    },
  }));

  describe('start()', () => {
    server.start();

    it('should start the server', (done) => request(server.getInstance()).get('/date').expect(200, done));
  });

  describe('addRoute()', () => {
    server.addRoute(new Route({
      method: 'GET',
      path: '/new-api',
      handler(req, res) {
        res.status(200).send({ test: 'ok' });
      },
    }));

    it('should add an API', (done) => request(server.getInstance()).get('/new-api').expect(200, done));
  });

  describe('GET /date', () => {
    it('should return a JSON with 200 response', (done) => request(server.getInstance()).get('/date').expect(200, done));
  });

  describe('GET /unknown', () => {
    it('should return a 404 response', (done) => request(server.getInstance()).get('/unknown').expect(404, done));
  });
});
