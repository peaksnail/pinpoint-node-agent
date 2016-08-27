//basic_packet.test.js
//

'use strict';
var expect = require('chai').expect;
var BasicPacket = require('../../../agent/commons/packet/basic_packet.js');

describe(__filename, function () {
    it('init basic packet', function () {
        var basicPacket = new BasicPacket('hello');
        expect(basicPacket).to.be.an('object');
    });
    it('init basic packet error', function () {
        expect(BasicPacket).to.throw();
    });
    it('basic packet get/set', function () {
        var basicPacket = new BasicPacket('hello');
        expect(basicPacket.getPayload()).to.be.equal('hello');
        basicPacket.setPayload('world');
        expect(basicPacket.getPayload()).to.be.equal('world');
    });
});

