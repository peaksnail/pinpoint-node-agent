/**
 * sampler factory
 *
 * Date: 2016-11-21 17:45
 * Author: zengshaojian
 *
 */
'use strict';
var SamplingRateSampler = require('./sampling_rate_sampler');
var TrueSampler = require('./true_sampler.js');
var FalseSampler = require('./false_sampler.js');

function createSampler(sampling, samplingRate) {
  if (!sampling || samplingRate <= 0) {
    return new FalseSampler();
  }
  if (samplingRate === 1) {
    return new TrueSampler();
  }
  return new SamplingRateSampler(samplingRate);
}

module.exports.createSampler = createSampler;


