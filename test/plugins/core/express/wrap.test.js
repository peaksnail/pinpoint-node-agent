/*
 * Copyright 2017 dmb.star-net.cn Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//wrap.test.js
//test the plugin send the trace data to collector

'use strict';
require('../../../mock_agent.js');
var expect = require('chai').expect;
var express = require("express");
var http = require("http");
var app = express();

//create express http server
app.get("/", function (request, response) {
  response.end("Welcome to the homepage!");
});
app.get("/get", function (request, response) {
  response.end("Welcome to the about page!");
});
app.post("/post", function (request, response) {
  response.end("Welcome to the about page!");
});
app.put("/put", function (request, response) {
  response.end("Welcome to the about page!");
});
app.delete("/delete", function (request, response) {
  response.end("Welcome to the about page!");
});
http.createServer(app).listen(1337);

var agent = global.PinpointNodejsAgent;

var options = {
    host: 'localhost',
    port: 1337,
    method: 'POST',
    path: '/post'
};

/* jshint expr: true */
describe(__filename, function () {
    it('express route get', function (done) {
        options.method = 'GET';
        options.path = '/get';
        var ret = http.request(options);
        ret.end();
        var cb = function () {
            expect(agent.hasReceiveNewData()).to.be.ok;
            done();
        };
        setTimeout(cb, 1000);
    });

    it('express route post', function (done) {
        options.method = 'POST';
        options.path = '/post';
        var ret = http.request(options);
        ret.end();
        var cb = function () {
            expect(agent.hasReceiveNewData()).to.be.ok;
            done();
        };
        setTimeout(cb, 1000);
    });
    it('express route put', function (done) {
        options.method = 'PUT';
        options.path = '/put';
        var ret = http.request(options);
        ret.end();
        var cb = function () {
            expect(agent.hasReceiveNewData()).to.be.ok;
            done();
        };
        setTimeout(cb, 1000);
    });
    it('express route delete', function (done) {
        options.method = 'DELETE';
        options.path = '/delete';
        var ret = http.request(options);
        ret.end();
        var cb = function () {
            expect(agent.hasReceiveNewData()).to.be.ok;
            done();
        };
        setTimeout(cb, 1000);
    });
});



