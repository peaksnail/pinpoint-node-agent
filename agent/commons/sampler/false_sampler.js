/**
 *
 *  false sampler
 *
 *  Date: 2016-11-21 15:20
 *  Author: zengshaojian
 *
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
