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

//sequence_number_singleton.test.js
//

'use strict';
var expect = require('chai').expect;
var Sequence= require('../../agent/utils/sequence_number_singleton.js');

describe(__filename, function () {

    var seq = Sequence.getSequenceNumber();
    Sequence= require('../../agent/utils/sequence_number_singleton.js');
    var seqAgain = Sequence.getSequenceNumber();

    it('getSequenceNumber', function () {
        expect(seqAgain - seq).to.be.equal(1);
    });
});

