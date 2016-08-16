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

