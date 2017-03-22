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
var Sampler = require('./sampler.js');
var util = require('util');

function FalseSampler() {
}

util.inherits(FalseSampler, Sampler);

FalseSampler.prototype.isSampling = function () {
  //always return false
  return false;
};

FalseSampler.prototype.toString = function () {
  return 'FalseSampler';
};

module.exports = FalseSampler;
