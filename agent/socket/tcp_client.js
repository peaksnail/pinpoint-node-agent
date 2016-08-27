/**
 *
 * tcp socket client
 *
 * Date: 2016-05-12 14:00
 * Author: psnail
 *
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
