//default_tbase_locator.test.js
//

'use strict';
var DefaultTBaseLocator= require('../../../agent/thrift/io/default_tbase_locator.js').DefaultTBaseLocator;
var expect = require('chai').expect;
var Header= require('../../../agent/thrift/io/header.js').Header;
var TSpan = require('../../../agent/thrift/dto/Trace_types.js').TSpan;

describe(__filename, function () {

    var defaultTBaseLocator = new DefaultTBaseLocator();
    var header = defaultTBaseLocator.headerLookup(new TSpan());

    //need complete deserialize the data to valid 

    /* jshint expr: true */
    it('create header', function () {
        expect(defaultTBaseLocator.createHeader(1)).to.be.instanceof(Header);
    });
    it('header lookup', function () {
        expect(header).to.be.instanceof(Header);
    });
    it('valid header type', function () {
        //tspan header type is 40
        expect(header.getType()).to.be.equal(40);
    });
});

