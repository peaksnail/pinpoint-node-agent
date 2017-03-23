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

'use strict';
var loggerFactory = require('../utils/logger_factory.js');
var net = require('net');
var Objects = require('../utils/objects.js');
var PacketUtil = require('../utils/packet_util.js');
var SocketClient = require('./socket_client.js');

var logger = loggerFactory.getLogger(__filename);

var TcpClient = function (host, port) {

    SocketClient.apply(this, arguments);
    this.host = host;
    this.port = port;
    this.client = new net.Socket();
};

Objects.extends(false, TcpClient, SocketClient);

TcpClient.prototype.connect = function (dataHandler) {

    logger.info('use tcp server ' + this.host + ':' + this.port);
    this.client.connect(this.port, this.host, function () {
        logger.info('build connection success');
    });

    this.client.on('data', dataHandler);

    this.client.on('close', function () {
        logger.info('connection closed');
        this.client.end();
    }.bind({client: this.client}));

    this.client.on('error', function (err) {
        logger.warn('connection error:' + err);
        this.client.destroy();
    }.bind({client: this.client}));
};


TcpClient.prototype.send = function (message, callback){

    if (this.SerializeFactory) {
        message = new PacketUtil.PacketEncode(message, this.SerializeFactory);
    }
    var status = this.client.write(message, function (err) {
        if (err) {
            logger.warn('message request failed!');
        }
        logger.info('message request success!');
    });

    if (typeof callback === 'function') {
        callback(status);
    }
};

TcpClient.prototype.send_directly = function (message, callback){

    var status = this.client.write(message, function (err) {
        if (err) {
            logger.warn('message request failed!');
        }
        logger.info('message request success!');
    });

    if (typeof callback === 'function') {
        callback(status);
    }
};

TcpClient.prototype.end = function () {
    this.client.end();
};

TcpClient.prototype.setSerialize = function (serializeFactory) {
    this.SerializeFactory = serializeFactory;
};


module.exports = TcpClient;
