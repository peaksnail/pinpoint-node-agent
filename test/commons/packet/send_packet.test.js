//send_packet.test.js
//

'use strict';
var expect = require('chai').expect;
var SendPacket = require('../../../agent/commons/packet/send_packet.js');
var PacketType = require('../../../agent/commons/packet/packet_type.js');

describe(__filename, function () {
    it('func: getPacketType', function () {
        var sendPacket = new SendPacket(new Buffer(1));
        expect(sendPacket.getPacketType()).to.equal(PacketType.APPLICATION_SEND);
    });
    //it('func: toBuffer', function () {
    //    var buffer = (new SendPacket(new Buffer(1))).toBuffer();
    //    expect(buffer).to.be.a(Buffer);
    //});
});

