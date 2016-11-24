'use strict';

var expect = require('chai').expect;
var Sampler = require('../../../agent/commons/sampler/sampler.js');

var sampler = new Sampler();

describe(__filename, function () {

  it('sampler interface', function () {
    expect(function () {
      sampler.isSampling()
    }).to.throw('interface isSampling must be implemented!');
  });

});
