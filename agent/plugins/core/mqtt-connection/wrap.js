/*
 * Copyright 2017 dmb.star-net.cn Corp.
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
var EventsFilter = require('./events_filter.js');
var PluginConstants = require('./constants.js').PluginConstants;
var ServiceTypeConstants = require('./constants.js').ServiceTypeConstants;
var traceContextFactory = require('../../../commons/trace/trace_context.js').traceContextFactory;

var interceptor = require('../../../commons/trace/method_interceptor.js');

var wrap = function (mc) {

  //this must be head of the request
  //and need to consider whether should get parent info from the request
  //according the online business
  var original_mc_on = mc.prototype.on;
  mc.prototype.on = function () {
    var e = arguments[0];
    var cb = arguments[1];

    //edit callback
    function mqtt1connection0prototype0on(original, proxy, argument) {
      var packet = argument[0];
      if (packet === undefined) {
        return original.apply(proxy, argument);
      } else if (packet.cmd in EventsFilter) {
        return original.apply(proxy, argument);
      }
      var traceContext = traceContextFactory();
      if (!traceContext) {
        return original.apply(proxy, argument);
      }
      var spanRecorder = traceContext.newTraceObject();
      spanRecorder.recordServiceType(ServiceTypeConstants.mqtt_connection);
      spanRecorder.recordApi('mqtt-connection.prototype.on');
      spanRecorder.recordRpcName('mqtt-connection event: ' + packet.cmd);
      var ret = original.apply(proxy, argument);
      traceContext.endTraceObject();
      return ret;
    }

    cb = interceptor(cb, mqtt1connection0prototype0on);
    var args = [e, cb];
    return original_mc_on.apply(this, args);
  };

  var original_mc_publish = mc.prototype.publish;

  function mqtt1connection0prototype0publish(original, proxy, argument) {
    var traceContext = traceContextFactory();
    if (!traceContext) {
      return original.apply(proxy, argument);
    }
    if (traceContext.hasInit()) {
      var spanEventRecorder = traceContext.continueTraceObject();
      spanEventRecorder.recordServiceType(ServiceTypeConstants.mqtt_connection);
      spanEventRecorder.recordApi('mqtt-connection.prototype.publish');
      spanEventRecorder.recordDestinationId(PluginConstants.destinationId);
    } else {
      var spanRecorder = traceContext.newTraceObject();
      spanRecorder.recordServiceType(ServiceTypeConstants.mqtt_connection);
      spanRecorder.recordApi('mqtt-connection.prototype.publish');
      spanRecorder.recordRpcName('mqtt-connection : publish');
    }
    var ret = original.apply(proxy, argument);
    traceContext.endTraceObject();
    return ret;
  }

  mc.prototype.publish = interceptor(original_mc_publish, mqtt1connection0prototype0publish);

  return mc;
};


module.exports = wrap;
