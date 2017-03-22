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

'use strict';

var expect = require('chai').expect;
var SamplerFactory = require('../../../agent/commons/sampler/sampler_factory.js');
var SamplingRateSampler = require('../../../agent/commons/sampler/sampling_rate_sampler.js');
var TrueSampler = require('../../../agent/commons/sampler/true_sampler.js');
var FalseSampler = require('../../../agent/commons/sampler/false_sampler.js');


describe(__filename, function () {

  it('get false sampler', function () {
    expect(SamplerFactory.createSampler(false, 1)).to.be.instanceof(FalseSampler);
    expect(SamplerFactory.createSampler(true, -1)).to.be.instanceof(FalseSampler);
  });

  it('get true sampler', function () {
    expect(SamplerFactory.createSampler(true, 1)).to.be.instanceof(TrueSampler);
  });

  it('get sampling rate sampler', function () {
    expect(SamplerFactory.createSampler(true, 10)).to.be.instanceof(SamplingRateSampler);
  });

});
