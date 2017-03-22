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

//tcp_client.test.js
//

'use strict';
var expect = require('chai').expect;
var SerializeFactory = require('../../agent/thrift/io/serialize.js');
var TcpClient = require('../../agent/socket/tcp_client.js');
var TAgentInfo = require('../../agent/thrift/dto/Pinpoint_types.js').TAgentInfo;

describe(__filename, function () {
    /* jshint expr: true */
    var bufferData = false;
    var tcpServerEnd = false;
    var tcpServerConnection = false;
    //create tcp server
    require('net').createServer(function (socket) {
        tcpServerConnection = true;
        /* jshint unused: false */
        socket.on('data', function(data){
            bufferData = true;
        }); 
        socket.on('end', function(data){
            tcpServerEnd = true; 
        });
    
    }).listen(9000);

    var tcpClient = new TcpClient('localhost', 9000);
    tcpClient.connect();
    tcpClient.setSerialize(new SerializeFactory());
    tcpClient.send(new TAgentInfo());
    tcpClient.end();
    it('tcp client connect', function () {
        expect(tcpServerConnection).to.be.ok;
    });
    it('tcp client send buffer', function () {
        expect(bufferData).to.be.ok;
    });
    it('tcp client end', function () {
        expect(tcpServerEnd).to.be.ok;
    });
});

