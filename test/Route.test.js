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

import Route from '../src/Route';

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

describe('Route', () => {
  it('should be importable from package', () => {
    expect(typeof Route).toEqual('function');
  });

  for (let i = 0; i < httpMethods.length; i += 1) {
    describe(`new Route() with method = ${httpMethods[i]}`, () => {
      it('should not throw an exception', () => {
        expect(() => {
          // eslint-disable-next-line
          new Route({
            method: httpMethods[i],
            path: '/',
            handler() {
            },
          });
        }).not.toThrow();
      });
    });
  }

  describe('new Route() with method = UNKNOWN', () => {
    it('should throw an exception', () => {
      expect(() => {
        // eslint-disable-next-line
        new Route({
          method: 'UNKNOWN',
          path: '/',
          handler() {
          },
        });
      }).toThrow();
    });
  });

  describe('getHandler()', () => {
    const route = new Route({
      method: 'get',
      path: '/',
      handler() {
      },
    });

    it('should return the handler', () => {
      expect(typeof route.getHandler()).toEqual('function');
    });
  });

  describe('getMethod()', () => {
    const route = new Route({
      method: 'get',
      path: '/',
      handler() {
      },
    });

    it('should return the method in uppercase', () => {
      expect(route.getMethod()).toEqual('GET');
    });
  });

  describe('getPath()', () => {
    const route = new Route({
      method: 'get',
      path: '/',
      handler() {
      },
    });

    it('should return the path', () => {
      expect(route.getPath()).toEqual('/');
    });
  });
});
