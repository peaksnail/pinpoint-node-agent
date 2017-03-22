/*
 * Copyright 2017 dmb.star-net.cn Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

