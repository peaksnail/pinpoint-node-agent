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
var Packet = function () {
    throw new Error('interface Packet can not init');
};

Packet.prototype.getPacketType = function () {
    throw new Error('getPacketType has not been implemented');
};

Packet.prototype.getPayload = function () {
    throw new Error('getPayload has not been implemented');
};

Packet.prototype.toBuffer = function () {
    throw new Error('toBuffer has not been implemented');
};

module.exports = Packet;
