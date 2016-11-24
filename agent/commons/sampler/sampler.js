/**
 *
 * agent sampler interface
 *
 * Date: 2016-11-21 14:40
 * Author: zengshaojian
 *
 */

'use strict';
function Sampler() {
}

Sampler.prototype.isSampling = function () {
  throw new Error('interface isSampling must be implemented!');
};

module.exports = Sampler;