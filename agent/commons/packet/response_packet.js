/**
 *
 * response packet class
 *
 * Date: 2016-05-17 17:00
 * Author: psnail
 *
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

ResponsePacket.prototype.getPacketType = function () {
    return PacketType.APPLICATION_RESPONSE;
};

ResponsePacket.prototype.toBuffer = function () {
    var header = new FixedBuffer(2 + 4 + 4); // short(16bits) + int(32bits + int(32bits))
    header.writeShort(PacketType.APPLICATION_RESPONSE);
    header.writeInt(this.requestId);
    return PayloadPacket.appendPayload(header, this.payload);
};


module.exports = ResponsePacket;
