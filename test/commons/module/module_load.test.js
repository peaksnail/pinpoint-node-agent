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

