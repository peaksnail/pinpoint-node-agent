//response_packet.test.js
//

'use strict';
var expect = require('chai').expect;
var ResponsePacket = require('../../../agent/commons/packet/response_packet.js');
var PacketType = require('../../../agent/commons/packet/packet_type.js');

describe(__filename, function () {
    it('func: init', function () {
        expect(ResponsePacket.bind(ResponsePacket)).to.throw('payload must be Buffer instance!');
        expect(ResponsePacket.bind(ResponsePacket, 1)).to.throw('payload must be Buffer instance!');
        expect(ResponsePacket.bind(ResponsePacket, 1, 1)).to.throw('payload must be Buffer instance!');
    });
    it('func: getPacketType', function () {
        var responsePacket = new ResponsePacket(1, new Buffer(1));
        expect(responsePacket.getPacketType()).to.equal(PacketType.APPLICATION_RESPONSE);
    });
    it('func: set/get', function () {
        var responsePacket = new ResponsePacket(1, new Buffer(1));
        expect(responsePacket.getRequestId()).to.equal(1);
        responsePacket.setRequestId(2);
        expect(responsePacket.getRequestId()).to.equal(2);
    });
    //it('func: toBuffer/readBuffer', function () {
    //    var responsePacket = new ResponsePacket(1, new Buffer(1));
    //    var sameResponsePacket = ResponsePacket.readBuffer(responsePacket.toBuffer());
    //    expect(sameResponsePacket).to.be.an('object');
    //});
});

