//log4js.test.js
//

'use strict';
var expect = require('chai').expect;
var moduleLoad = require('../../../agent/commons/module/module_load.js');
var MethodDescriptorGenerator = require('../../../agent/utils/method_descriptor_generator.js');

describe(__filename, function () {
    it('module load', function () {
        var http = require('http');
        expect(http).to.be.an('object');
    });
    it('load api list', function () {
        var methodDesGenerator = moduleLoad.loadPluginsApiDetails();
        expect(methodDesGenerator).to.be.an.instanceof(MethodDescriptorGenerator);
        expect(Object.keys(methodDesGenerator.methodDescriptorList)).to.have.length.above(1);
    });
});

