/**
 *
 * basic packet abstract class
 *
 * Date: 2016-05-12 9:20
 * Author: psnail
 *
 */

'use strict';
var Packet = require('./packet.js');
var Objects = require('../../utils/objects.js');


var BasicPacket = function (payload) {
    if (!payload) {
        throw new Error('payload can not be null or undefined!');
    }
    this.payload = payload;
};

Objects.implements(false, BasicPacket, Packet);

BasicPacket.prototype.getPayload = function () {
    return this.payload;
};

BasicPacket.prototype.setPayload = function (payload) {
    this.payload = payload;
};



module.exports = BasicPacket;
