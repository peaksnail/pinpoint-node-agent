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
