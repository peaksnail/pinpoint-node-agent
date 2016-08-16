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



