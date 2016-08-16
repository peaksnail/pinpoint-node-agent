/**
 *
 * socket client abstract class
 *
 * Date: 2016-05-04 22:45
 * Author: psnail
 *
 */

'use strict';
var SocketClient = function (host, port) {

	if (host === undefined || host === null) {
        throw new Error('host can not be null or undefined');
	}
	if (port === undefined || port === null) {
        throw new Error('port can not be null or undefined');
	}

    this.port = null;
    this.host = null;
    this.client = null;
};

/* jshint unused:false */
SocketClient.prototype.send = function (data) {
    throw new Error('abstract method has not been override!');
};


module.exports = SocketClient;
