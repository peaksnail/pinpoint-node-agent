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

