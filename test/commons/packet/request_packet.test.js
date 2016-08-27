//request_packet.test.js
//

'use strict';
var expect = require('chai').expect;
var RequestPacket = require('../../../agent/commons/packet/request_packet.js');
var PacketType = require('../../../agent/commons/packet/packet_type.js');

describe(__filename, function () {

    it('func: init', function () {
        expect(RequestPacket.bind(RequestPacket)).to.throw('payload must be Buffer instance!');
        expect(RequestPacket.bind(RequestPacket, 1)).to.throw('payload must be Buffer instance!');
        expect(RequestPacket.bind(RequestPacket, 1, 1)).to.throw('payload must be Buffer instance!');
    });
    it('func: getPacketType', function () {
        var requestPacket = new RequestPacket(1, new Buffer(1));
        expect(requestPacket.getPacketType()).to.equal(PacketType.APPLICATION_REQUEST);
    });
    //it('func: toBuffer', function () {
    //    var buffer = (new PongPacket()).toBuffer();
    //    expect(buffer.length).to.equal(2);
    //});
});

