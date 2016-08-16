/**
 *
 * https module wrap
 *
 * Date: 2016-05-16 23:00
 * Author: psnail
 *
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
