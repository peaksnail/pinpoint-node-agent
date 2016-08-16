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

