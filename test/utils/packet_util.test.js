/*
 * Copyright 2017 dmb.star-net.cn
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

