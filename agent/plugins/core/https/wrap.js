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
var interceptor = require('../../../commons/trace/method_interceptor.js');
var pathFilter = require('./path_filter.js');
var ServiceTypeConstants = require('./https_constants.js').ServiceTypeConstants;
var traceContextFactory = require('../../../commons/trace/trace_context.js').traceContextFactory;


var wrap = function (https) {

  var original_createServer = https.createServer;

  //edit the requestListener
  https.createServer = function createServer() {
    var opts = arguments[0];
    var original_requestListener = arguments[1];

    function https0createServer0requestListener(original, proxy, argument) {
      var req = argument[0];
      //sorry to do like that I filter some useless path
      for (var prefix in pathFilter) {
        if (req.url.startsWith(prefix)) {
          return original.apply(proxy, argument);
        }
      }
      var traceContext = traceContextFactory();
      if (!traceContext) {
        return original.apply(proxy, argument);
      }
      if (traceContext.hasInit()) {
        var spanEventRecorder = traceContext.continueTraceObject();
        spanEventRecorder.recordApi('https.createServer.requestListener');
        spanEventRecorder.recordServiceType(ServiceTypeConstants.serviceType);
        spanEventRecorder.recordRpcName(req.url);
      } else {
        //need to judge from other node
        var spanRecorder = traceContext.newTraceObject();
        spanRecorder.recordServiceType(ServiceTypeConstants.serviceType);
        spanRecorder.recordApi('https.createServer.requestListener');
        spanRecorder.recordRpcName(req.url);
      }
      var ret = original.apply(proxy, argument);
      traceContext.endTraceObject();
      return ret;
    }

    original_requestListener = interceptor(original_requestListener, https0createServer0requestListener);
    var args = [opts, original_requestListener];
    return original_createServer.apply(this, args);
  };

  return https;
};


module.exports = wrap;
