'use strict';

var expect = require('chai').expect;
var TrueSampler = require('../../../agent/commons/sampler/true_sampler.js');

var sampler = new TrueSampler();

describe(__filename, function () {

  it('true sampler isSampling()', function () {
    expect(sampler.isSampling()).to.be.ok;
  });

});
