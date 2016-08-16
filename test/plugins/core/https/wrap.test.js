//wrap.test.js
//test the plugin send the trace data to collector

'use strict';
require('../../../mock_agent.js');
var expect = require('chai').expect;
var https = require('https');

var agent = global.PinpointNodejsAgent;

/* jshint expr:true */

describe(__filename, function () {
    it('http get', function (done) {
        https.get('https://www.baidu.com');
        var cb = function () {
            expect(agent.hasReceiveNewData()).to.be.ok;
            done();
        };
        setTimeout(cb, 1000);
    });

    it('http request', function (done) {
        https.request('https://www.baidu.com');
        var cb = function () {
            expect(agent.hasReceiveNewData()).to.be.ok;
            done();
        };
        setTimeout(cb, 1000);
    });
});



