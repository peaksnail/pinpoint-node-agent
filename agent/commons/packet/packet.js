/**
 *
 * packet interface
 *
 * Date: 2016-05-11 16:30
 * Author: psnail
 *
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
