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

'use strict';
var dgram = require('dgram');
var loggerFactory = require('../utils/logger_factory.js');
var Objects = require('../utils/objects.js');
var SocketClient = require('./socket_client.js');

var logger = loggerFactory.getLogger(__filename);

var UdpClient = function (host, port) {

    SocketClient.apply(this, arguments);
    this.host = host;
    this.port = port;
    this.client = dgram.createSocket('udp4');
    logger.info('use udp server ' + host + ':' + port);
};

Objects.extends(false, UdpClient, SocketClient);

UdpClient.prototype.send = function (message) {

    //this.resetClientStatus();

    //check whether use serialize
    if (this.SerializeFactory) {
        message = this.SerializeFactory.serialize(message); 
    }

    this.client.send(message, 0, message.length, this.port, this.host, function (err, bytes) {
        if (err) throw err;
        logger.debug('UDP message sent to ' + this.host +':'+ this.port + ', size is: ' + bytes);
    }.bind({host: this.host, port: this.port, client: this.client}));
};

UdpClient.prototype.resetClientStatus = function () {
    this.client = dgram.createSocket('udp4');
};

UdpClient.prototype.setSerialize = function (serializeFactory) {
   this.SerializeFactory = serializeFactory; 
};

UdpClient.prototype.clearSerialize = function () {
   this.serialize = undefined; 
};

module.exports = UdpClient;
