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
