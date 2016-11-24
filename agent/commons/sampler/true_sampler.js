/**
 *
 *  true sampler
 *
 *  Date: 2016-11-21 14:50
 *  Author: zengshaojian
 *
 */

'use strict';
var Sampler = require('./sampler.js');
var util = require('util');

function TrueSampler() {
}

util.inherits(TrueSampler, Sampler);

TrueSampler.prototype.isSampling = function () {
  //always return true
  return true;
};

TrueSampler.prototype.toString = function () {
  return 'TrueSampler';
};

module.exports = TrueSampler;
