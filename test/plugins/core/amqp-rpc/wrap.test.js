//wrap.test.js
//test the plugin send the trace data to collector

'use strict';
require('../../../mock_agent.js');
var expect = require('chai').expect;
var amqp = require('amqp-rpc');

var agent = global.PinpointNodejsAgent;

var rpc = new amqp.amqpRPC();
rpc.call();

/* jshint expr: true */
describe(__filename, function () {
    it('amqp call', function () {
        expect(agent.hasReceiveNewData()).to.be.ok;
    });
});

