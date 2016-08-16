//tcp_client.test.js
//

'use strict';
var expect = require('chai').expect;
var SerializeFactory = require('../../agent/thrift/io/serialize.js');
var PacketUtil = require('../../agent/utils/packet_util.js');
var TAgentInfo = require('../../agent/thrift/dto/Pinpoint_types.js').TAgentInfo;

describe(__filename, function () {
    var buffer = new PacketUtil(new TAgentInfo(),new SerializeFactory());

    it('packet util', function () {
        expect(buffer).to.be.an.instanceof(Buffer);
    });
});

