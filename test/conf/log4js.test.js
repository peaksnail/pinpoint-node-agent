//log4js.test.js
//
'use strict';

var expect = require('chai').expect;
var log4js = require('../../agent/conf/log4js.js');

var DEFAULTLOGPATH = 'defaultLogPath';
var DEFAULTCATEGORY = 'defaultCategory';
var APPENDERS = 'appenders';
var LEVELS= 'levels';

describe(__filename, function () {
    it('judge log4js conf format', function () {
        expect(log4js).to.be.an('object');
    });
    it('log4js conf key defined:' + DEFAULTLOGPATH, function () {
        expect(log4js[DEFAULTLOGPATH]).to.be.not.equal(undefined);
    });
    it('log4js conf key defined:' + DEFAULTCATEGORY, function () {
        expect(log4js[DEFAULTCATEGORY]).to.be.not.equal(undefined);
    });
    it('log4js conf key defined:' + APPENDERS, function () {
        expect(log4js[APPENDERS]).to.be.not.equal(undefined);
    });
    it('log4js conf key defined:' + LEVELS, function () {
        expect(log4js[LEVELS]).to.be.not.equal(undefined);
    });
});

