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

//header.test.js
//

'use strict';
var expect = require('chai').expect;
var Header= require('../../../agent/thrift/io/header.js').Header;

describe(__filename, function () {

    /* jshint expr: true */

    var header = new Header(-17, 16, 40);
    it('get header signature', function () {
        expect(header.getSignature()).to.be.equal(-17);
    });
    it('get header version', function () {
        expect(header.getVersion()).to.be.equal(16);
    });
    it('get header type', function () {
        expect(header.getType()).to.be.equal(40);
    });

    it('set header signature', function () {
        header.setSignature(34);
        expect(header.getSignature()).to.be.equal(34);
    });
    it('set header version', function () {
        header.setVersion(4);
        expect(header.getVersion()).to.be.equal(4);
    });
    it('set header type', function () {
        header.setType(56);
        expect(header.getType()).to.be.equal(56);
    });
});

