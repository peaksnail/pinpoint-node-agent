/**
 *
 * pong packet class
 *
 * Date: 2016-08-24 21:30
 * Author: psnail
 *
 */

'use strict';
var BasicPacket = require('./basic_packet.js');
var Objects = require('../../utils/objects.js');
var PacketType = require('./packet_type.js');
var FixedBuffer = require('../buffer/fixed_buffer.js');

var PongPacket = function () {
};

Objects.extends(false, PongPacket, BasicPacket);

PongPacket.prototype.getPacketType = function () {
    return PacketType.CONTROL_PONG;
};

PongPacket.prototype.toBuffer = function () {
    var buffer = new FixedBuffer(2);
    buffer.writeShort(PacketType.CONTROL_PONG)
    return buffer.getBuffer();
};


module.exports = PongPacket;
