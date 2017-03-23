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

//serialize.test.js
//

'use strict';
var expect = require('chai').expect;
var defaultTBaseLocator = require('../../../agent/thrift/io/default_tbase_locator.js').DefaultTBaseLocator;
var Header= require('../../../agent/thrift/io/header.js').Header;
var Serialize= require('../../../agent/thrift/io/serialize.js');
var TSpan = require('../../../agent/thrift/dto/Trace_types.js').TSpan;

describe(__filename, function () {

    var tSpan = new TSpan();
    var header = new Header();
    var serialize = new Serialize();

    it('serialize', function () {
        expect(serialize.serialize(tSpan)).to.be.instanceof(Buffer);
    });
    it('header serialize', function () {
        expect(serialize.headerSerialize(header)).to.be.instanceof(Buffer);
    });
    it('get locator', function () {
        expect(serialize.getLocator()).to.be.instanceof(defaultTBaseLocator);
    });
    it('get header', function () {
        expect(serialize.getHeader()).to.be.instanceof(Header);
    });
});

