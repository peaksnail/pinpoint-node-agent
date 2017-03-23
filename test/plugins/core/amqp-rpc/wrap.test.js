/*
 * Copyright 2017 dmb.star-net.cn
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

