//read_config.test.js
//

'use strict';
var Configuration = require('../../agent/conf/read_config.js');
var expect = require('chai').expect;
var path = require('path');

var config = new Configuration();
var configUsingFile = new Configuration(path.join(__dirname, 'pinpoint.config'));

describe(__filename, function () {
    it('using define conf file', function () {
        expect(configUsingFile.getConfig()).to.be.instanceof(Array);
    });
    it('get conf array', function () {
        expect(configUsingFile.getConfig()).to.be.instanceof(Array);
    });
    it('get conf length', function () {
        expect(Object.keys(config.getConfig())).to.have.length.above(1);
    });
    it('get default value', function () {
        expect(configUsingFile.get('conf.test.undefined', 'value')).to.be.equal('value');
    });
    it('get default value', function () {
        expect(configUsingFile.get('conf.test.undefined', 300)).to.be.equal(300);
    });
    it('get default value', function () {
        expect(configUsingFile.get('conf.test.undefined', true)).to.be.equal(true);
    });
    it('get conf value', function () {
        expect(configUsingFile.get('agent.id', 'value')).to.be.equal('agent-id');
    });
    it('get conf boolean value', function () {
        expect(configUsingFile.get('trace.manager.enable', true)).to.be.equal(false);
    });
    it('get conf number value', function () {
        expect(configUsingFile.get('trace.metadata.retention', 3)).to.be.equal(30000);
    });
});

