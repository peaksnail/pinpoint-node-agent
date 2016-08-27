//pong_packet.test.js
//

'use strict';
var expect = require('chai').expect;
var PongPacket = require('../../../agent/commons/packet/pong_packet.js');
var PacketType = require('../../../agent/commons/packet/packet_type.js');

describe(__filename, function () {
    it('func: getPacketType', function () {
        var pongPacket = new PongPacket();
        expect(pongPacket.getPacketType()).to.equal(PacketType.CONTROL_PONG);
    });
    it('func: toBuffer', function () {
        var buffer = (new PongPacket()).toBuffer();
        expect(buffer.length).to.equal(2);
    });
});

