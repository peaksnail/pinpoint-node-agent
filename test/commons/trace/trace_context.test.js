/*
 * Copyright 2017 dmb.star-net.cn
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var cls = require('continuation-local-storage');
var expect = require('chai').expect;
var metadata = require('../../../agent/utils/constants.js').PinpointTraceMetaData;
var TrueSampler = require('../../../agent/commons/sampler/true_sampler.js');
var FalseSampler = require('../../../agent/commons/sampler/false_sampler.js');
var SamplingRateSampler = require('../../../agent/commons/sampler/sampling_rate_sampler.js');

global.PinpointNodejsAgent = {};

describe(__filename, function () {

  it('trace context factory with true sampler', function (done) {
    var ns = cls.createNamespace(metadata.TRACE_CONTEXT);
    ns.run(function () {

      global.PinpointNodejsAgent.sampler = new TrueSampler();
      var traceContextFactory = require('../../../agent/commons/trace/trace_context.js').traceContextFactory;
      var TraceContext = require('../../../agent/commons/trace/trace_context.js').TraceContext;

      //test args: undefined
      expect(traceContextFactory()).to.be.instanceof(TraceContext);
      ns.set(metadata.TRANSACTION, null);

      //test args: true
      expect(traceContextFactory(true)).to.be.instanceof(TraceContext);
      ns.set(metadata.TRANSACTION, null);
      done();

    });
  });

  it('trace context factory with false sampler', function (done) {

    //reload trace context
    Object.keys(require.cache).forEach(function (key) {
      if (key.indexOf('trace_context.js')) {
        delete require.cache[key];
      }
    });
    var ns = cls.createNamespace(metadata.TRACE_CONTEXT);
    ns.run(function () {

      global.PinpointNodejsAgent.sampler = new FalseSampler();
      var traceContextFactory = require('../../../agent/commons/trace/trace_context.js').traceContextFactory;
      var TraceContext = require('../../../agent/commons/trace/trace_context.js').TraceContext;

      //test args: true
      expect(traceContextFactory(true)).to.be.instanceof(TraceContext);
      //continue last transaction
      expect(traceContextFactory()).to.be.instanceof(TraceContext);
      ns.set(metadata.TRANSACTION, null);

      //test args: undefined
      expect(traceContextFactory()).to.be.equal(null);
      done();

    });
  });

  it('trace context factory with sampling rate sampler', function (done) {

    //reload trace context
    Object.keys(require.cache).forEach(function (key) {
      if (key.indexOf('trace_context.js')) {
        delete require.cache[key];
      }
    });
    var ns = cls.createNamespace(metadata.TRACE_CONTEXT);
    ns.run(function () {

      global.PinpointNodejsAgent.sampler = new SamplingRateSampler(10);
      var traceContextFactory = require('../../../agent/commons/trace/trace_context.js').traceContextFactory;
      var TraceContext = require('../../../agent/commons/trace/trace_context.js').TraceContext;

      //test new trace context with simpling rate
      var count = 0;
      for (var i = 0; i < 10; i++) {
        if (traceContextFactory()) {
          count++;
        }
        ns.set(metadata.TRANSACTION, null);
      }
      expect(count).to.be.equal(1);

      //test continue
      for (var i = 0; i < 10; i++) {
        traceContextFactory();
      }
      expect(traceContextFactory()).to.be.instanceof(TraceContext);

      //test force to sample
      count = 0;
      for (var i = 0; i < 10; i++) {
        if (traceContextFactory(true)) {
          count++;
        }
      }
      expect(count).to.be.equal(10);

      done();

    });
  });

});
