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

