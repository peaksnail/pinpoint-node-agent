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
var SamplingRateSampler = require('../../../agent/commons/sampler/sampling_rate_sampler.js');

var LOOP = 100;

describe(__filename, function () {

  it('sampling rate sampler isSampling() with 1/10', function () {
    var rate = 10;
    var sampler = new SamplingRateSampler(rate);
    var count = 0;
    for (var i = 0; i < LOOP; i++) {
      if (sampler.isSampling()) {
        count++;
      }
    }
    expect(count).to.be.equal(10);
  });

  it('sampling rate sampler isSampling() with 1/100', function () {
    var rate = 100;
    var sampler = new SamplingRateSampler(rate);
    var count = 0;
    for (var i = 0; i < LOOP; i++) {
      if (sampler.isSampling()) {
        count++;
      }
    }
    expect(count).to.be.equal(1);
  });

  it('sampling rate sampler isSampling() with 1/1', function () {
    var rate = 1;
    var sampler = new SamplingRateSampler(rate);
    var count = 0;
    for (var i = 0; i < LOOP; i++) {
      if (sampler.isSampling()) {
        count++;
      }
    }
    expect(count).to.be.equal(LOOP);
  });

  it('sampling rate sampler init', function () {
    expect(function () {
      new SamplingRateSampler(0);
    }).to.throw('invalid');
  });

});
