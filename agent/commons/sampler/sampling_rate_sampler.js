/**
 *  sampling rate sampler
 *
 *  Date: 2016-11-21 15:30
 *  Author: zengshaojian
 *
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
