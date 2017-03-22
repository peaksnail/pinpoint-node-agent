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

