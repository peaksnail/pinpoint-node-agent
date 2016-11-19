/**
 *
 * amqp-rpc pinpoint agent plugin
 *
 * Date: 2016-05-18
 * Author: psnail
 *
 */

'use strict';
var cls = require('../../../commons/cls');
var PinpointNodejsAgent = global.PinpointNodejsAgent;
var PinpointMetaData = require('../../../utils/constants.js').PinpointMetaData;
var PluginConstants = require('./amqp-rpc_constants.js').PluginConstants;
var PinpointTraceMetaData = require('../../../utils/constants.js').PinpointTraceMetaData;
var ServiceTypeConstants = require('./amqp-rpc_constants.js').ServiceTypeConstants;
var traceContextFactory = require('../../../commons/trace/trace_context.js').traceContextFactory;
var TraceId = require('../../../commons/trace/trace_id.js');

var interceptor = require('../../../commons/trace/method_interceptor.js');

var wrap = function (amqpRPC) {

    var original_amqpRPC = amqpRPC.amqpRPC;
    var original_amqpRPC_call = original_amqpRPC.prototype.call;
    //modify amqpRPC 
    function amqp1rpc0amqpRPC0call(original, proxy, argument) {

    	var cmd = argument[0];
		var params = argument[1];
		var original_callback = argument[2];
		var context = argument[3];
		var options = argument[4];

        if (params === undefined) {
            params = {};
        }
		var traceContext = traceContextFactory();
		var spanRecorder = traceContext.spanRecorder;
        if (!traceContext.hasInit()) {
            spanRecorder = traceContext.newTraceObject();
            spanRecorder.recordServiceType(ServiceTypeConstants.serviceType);
            spanRecorder.recordApi('amqp-rpc.amqpRPC.call');
            spanRecorder.recordRpcName(params.t);
		}
        var metadata = spanRecorder.getNextSpanHeader();
        metadata[PinpointMetaData.ENDPOINT] = PluginConstants.endPoint;
        metadata[PinpointMetaData.ACCEPTORHOST] = PluginConstants.destinationId;
        metadata[PinpointMetaData.REMOTEADDRESS] = PinpointNodejsAgent.agentIp;
        params[PinpointMetaData.PINPOINT_METADATA] = metadata;

        //for server continue
        var spanEventRecorder = traceContext.continueTraceObject();
		spanEventRecorder.recordRpcName(params.t);
        spanEventRecorder.recordApi('amqp-rpc.amqpRPC.call');
        spanEventRecorder.recordNextSpanId(spanRecorder.getNextSpanId());
        spanEventRecorder.recordServiceType(ServiceTypeConstants.serviceType);
        spanEventRecorder.recordEndPoint(PluginConstants.endPoint);
        spanEventRecorder.recordDestinationId(PluginConstants.destinationId);

   		//modify callback
		//there has some bug when edit the cb
		//client can not execute the cb when edit the cb
		/* jshint unused: false */
   		function callback(ret) {

   		    if (original_callback && (typeof original_callback) === 'function') {
                try {
   		            original_callback(ret);
                } catch(err) {
                    traceContext.recordException(err);
                }
			}
			traceContext.endTraceObject();
   		}

        var ns = cls.getNamespace(PinpointTraceMetaData.TRACE_CONTEXT);
        original_callback = ns.bind(original_callback);
   		var args = [cmd, params, original_callback, context, options];
		var ret;
        try {
   		    ret = original.apply(proxy, args);
        } catch(err) {
            traceContext.recordException(err);
        }
		traceContext.endTraceObject();
		return ret;
   	}
	original_amqpRPC.prototype.call = interceptor(original_amqpRPC_call, amqp1rpc0amqpRPC0call);

	
	//modify prototype function on
	//listening the queue or some other events,so just monitor the callback
    var original_amqpRPC_on = original_amqpRPC.prototype.on;
    original_amqpRPC.prototype.on = function () {
		var cmd = arguments[0];
		var cb = arguments[1];
		var context = arguments[2];
		var options = arguments[3];
		var args = [];

		function amqp1rpc0amqpRPC0on(original, proxy, argument) {
		
			if (original && (typeof original) === 'function') {
				var msg = argument[0];
				var metadata = msg[PinpointMetaData.PINPOINT_METADATA];
				var traceContext = traceContextFactory();
				var traceId;
				if (metadata !== undefined) {
                	//get parent transaction info
                	traceId = new TraceId(metadata[PinpointMetaData.TRANSACTION_ID],
                	        metadata[PinpointMetaData.PARENT_SPAN_ID],
                	        metadata[PinpointMetaData.SPAN_ID],
                	        metadata[PinpointMetaData.FLAG]);
					delete msg[PinpointMetaData.PINPOINT_METADATA];
				} else {
					metadata = {};
				}
				var spanRecorder = traceContext.newTraceObject(traceId);
                spanRecorder.recordApi('amqp-rpc.amqpRPC.on');
                spanRecorder.recordRpcName(msg.t);
                spanRecorder.recordServiceType(ServiceTypeConstants.serviceType);
                var parentApplicationName = metadata[PinpointMetaData.PARENT_APPLICATION_NAME];
            	var parentApplicationType = metadata[PinpointMetaData.PARENT_APPLICATION_TYPE];
            	spanRecorder.recordParentApplication(parentApplicationName, parentApplicationType);
            	spanRecorder.recordEndPoint(metadata[PinpointMetaData.ENDPOINT]);
            	spanRecorder.recordRemoteAddress(metadata[PinpointMetaData.REMOTEADDRESS]);
            	spanRecorder.recordAcceptorHost(metadata[PinpointMetaData.ACCEPTORHOST]); 
				try {
					var args = argument;
					msg[PinpointTraceMetaData.TRACE_CONTEXT] = traceContext;
					args[0] = msg;
					original.apply(proxy, args);
					traceContext.endTraceObject();	
				} catch(err) {
					traceContext.recordException(err);	
					traceContext.endTraceObject();	
				}
			}

		}
		var callback = interceptor(cb, amqp1rpc0amqpRPC0on);
		args = [cmd, callback, context, options];
		if (cmd === 'error' || cmd === 'ready') {
			args = [cmd, cb, context, options];
		}
		return original_amqpRPC_on.apply(this, args);
	};

	amqpRPC.amqpRPC = original_amqpRPC;
    return amqpRPC;
};


module.exports = wrap;
