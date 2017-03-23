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

//agent.test.js
//
'use strict';

var Agent = require('../../agent/commons/agent.js');
var Configuration = require('../../agent/conf/read_config.js');
var dgram = require('dgram');
var expect = require('chai').expect;
var path = require('path');


//start tcp and udp server
//tcp
var tcpConnect = false;
var tcpServerEnd = false;
var tcpDataReceive = false;
var spanDataReceive = false;
var spanConnect = false;
var statConnect = false;
var bufferData = false;
require('net').createServer( function (socket) {
    tcpConnect = true;
    /* jshint unused: false*/
    socket.on('data', function (data) {
        tcpDataReceive = true;
    }); 
    socket.on('end', function (data) {
        tcpServerEnd = true; 
    });

}).listen(8991);

//span
var spanServer = dgram.createSocket('udp4');
spanServer.on('listening', function () {
    spanConnect = true;
});
/* jshint unused: false*/
spanServer.on('message', function (message, remote) {
	spanDataReceive = true;
});
spanServer.bind(8999, '127.0.0.1');

//stat
var statServer = dgram.createSocket('udp4');
statServer.on('listening', function () {
    statConnect = true;
});
/* jshint unused: false*/
statServer.on('message', function (message, remote) {
	bufferData = true;
});
statServer.bind(8995, '127.0.0.1');


//get agent conf 
var conf =  new Configuration(path.join(__dirname, 'pinpoint.config'));

var defaultAgent = new Agent(conf);
global.PinpointNodejsAgent = defaultAgent;

//start agent socket client 
defaultAgent.startTcpClient();
defaultAgent.startUdpClient();

//start send agentInfo
defaultAgent.sendAgentInfo();

//start hack load and load plugins
defaultAgent.hackModuleLoad();

//start to send api info
defaultAgent.sendApiInfo();

//start trace manager
defaultAgent.startTraceManager();
//console.log(defaultAgent.agentStartTime)

/* jshint expr: true */
describe(__filename, function () {
    it('start tcp client', function () {
        expect(tcpConnect).to.be.ok;
        expect(tcpDataReceive).to.be.ok;
    });
    it('start udp client', function () {
        expect(spanConnect).to.be.ok;
        expect(statConnect).to.be.ok;
    });
});

