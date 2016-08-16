/**
 *
 * send packet class
 *
 * Date: 2016-05-11 18:40
 * Author: psnail
 *
 */

'use strict';
var BasicPacket = require('./basic_packet.js');
var Objects = require('../../utils/objects.js');
var PacketType = require('./packet_type.js');
var FixedBuffer = require('../buffer/fixed_buffer.js');
var PayloadPacket = require('../../utils/payload_packet.js');

var SendPacket = function (payload) {
    if ((payload instanceof Buffer) === false) {
        throw new Error('payload must be Buffer instance!');
    }
    this.payload = payload;
};

Objects.extends(false, SendPacket, BasicPacket);

SendPacket.prototype.getPacketType = function () {
    return PacketType.APPLICATION_SEND;
};

SendPacket.prototype.toBuffer = function () {
    var header = new FixedBuffer(2 + 4); // short(16bits) + int(32bits)
    header.writeShort(PacketType.APPLICATION_SEND);
    return PayloadPacket.appendPayload(header, this.payload);
};


module.exports = SendPacket;
