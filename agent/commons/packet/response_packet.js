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
var BasicPacket = require('./basic_packet.js');
var Objects = require('../../utils/objects.js');
var PacketType = require('./packet_type.js');
var FixedBuffer = require('../buffer/fixed_buffer.js');
var PayloadPacket = require('../../utils/payload_packet.js');

var ResponsePacket = function (requestId, payload) {
    if ((payload instanceof Buffer) === false) {
        throw new Error('payload must be Buffer instance!');
    }
    this.payload = payload;
    this.requestId = requestId;
};

Objects.extends(false, ResponsePacket, BasicPacket);

ResponsePacket.prototype.setRequestId = function (requestId) {
    this.requestId = requestId;
};

ResponsePacket.prototype.getRequestId = function (requestId) {
    return this.requestId;
};

ResponsePacket.prototype.getPacketType = function () {
    return PacketType.APPLICATION_RESPONSE;
};

ResponsePacket.prototype.toBuffer = function () {
    var header = new FixedBuffer(2 + 4 + 4); // short(16bits) + int(32bits + int(32bits))
    header.writeShort(PacketType.APPLICATION_RESPONSE);
    header.writeInt(this.requestId);
    return PayloadPacket.appendPayload(header, this.payload);
};

ResponsePacket.readBuffer = function (packetType, buffer) {
    if(packetType !== PacketType.APPLICATION_RESPONSE){
        return;
    }
    var messageId = buffer.readInt();
    var payload = PayloadPacket.readPayload(buffer);
    //todo payload to buffer
    var responsePacket = new ResponsePacket(0, new Buffer([payload]));
    responsePacket.setRequestId(messageId);
    return responsePacket;
};

module.exports = ResponsePacket;
