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

//udp_client.test.js
//

'use strict';
var expect = require('chai').expect;
var dgram = require('dgram');
var SerializeFactory = require('../../agent/thrift/io/serialize.js');
var UdpClient = require('../../agent/socket/udp_client.js');
var TAgentInfo = require('../../agent/thrift/dto/Pinpoint_types.js').TAgentInfo;

describe(__filename, function(){
    /* jshint expr: true */
    var bufferData = false;
    //create udp server
	var PORT = 33333;
	var HOST = '127.0.0.1';
	var server = dgram.createSocket('udp4');
	server.on('listening', function () {
	});
    /* jshint unused: false */
	server.on('message', function (message, remote) {
		bufferData = true;
	});
	server.bind(PORT, HOST);

    var udpClient = new UdpClient(HOST, PORT);
    udpClient.setSerialize(new SerializeFactory());
	var message = new TAgentInfo();
    udpClient.send(message);
    it('udp client send', function () {
        expect(bufferData).to.be.ok;
    });
});

