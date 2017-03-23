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

'use strict';
var Sampler = require('./sampler.js');
var util = require('util');

var MAX_INTEGER = Math.pow(2, 31) - 1;

function SamplingRateSampler(samplingRate) {
  this.counter = 0;
  if (!Number(samplingRate) || samplingRate <= 0) {
    throw new Error('invalid samplingRate ' + samplingRate);
  }
  this.samplingRate = samplingRate;
}

util.inherits(SamplingRateSampler, Sampler);

SamplingRateSampler.prototype.isSampling = function () {

  var samplingCount = this.counter > MAX_INTEGER ? (this.counter = 1) && 0 : this.counter++;
  var isSampling = samplingCount % this.samplingRate;
  return isSampling === 0;

};

SamplingRateSampler.prototype.toString = function () {
  return 'SamplingRateSampler{' +
    'counter=' + this.counter + ', ' +
    'samplingRate=' + this.samplingRate +
    '}';
};

module.exports = SamplingRateSampler;
