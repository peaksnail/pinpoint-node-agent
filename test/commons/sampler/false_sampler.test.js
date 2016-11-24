'use strict';

var expect = require('chai').expect;
var FalseSampler = require('../../../agent/commons/sampler/false_sampler.js');

var sampler = new FalseSampler();

describe(__filename, function () {

  it('false sampler isSampling()', function () {
    expect(sampler.isSampling()).to.not.be.ok;
  });

});
