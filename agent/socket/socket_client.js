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
