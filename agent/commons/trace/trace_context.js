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

var cls = require('../cls');
var Configuration = require('../../conf/read_config.js');
var Constants = require('../../utils/constants.js').ConfigConstants;
var loggerFactory = require('../../utils/logger_factory.js');
var PinpointTraceMetaData = require('../../utils/constants.js').PinpointTraceMetaData;
var SpanRecorder = require('./span_recorder.js');
var SpanEventRecorder = require('./span_event_recorder.js');

var PinpointNodejsAgent = global.PinpointNodejsAgent;
var conf = new Configuration();
var logger = loggerFactory.getLogger(__filename);

var HANDLE_RETENTION = conf.get(Constants.TRACE_METADATA_RETENTION, 30000);
var TRACE_MANAGER_ENABLE = conf.get(Constants.TRACE_MANAGER_ENABLE, false);

if (HANDLE_RETENTION > 0) {
    logger.info('use trace context setTimeout to handle trace data'); 
} else if (HANDLE_RETENTION === 0) {
    logger.info('use cls module to handle trace data'); 
} else {
    logger.info('HANDLE_RETENTION is invalid: ' + HANDLE_RETENTION); 
}

var TraceContext = function TraceContext(sampling) {
    
    this.spanRecorder = null;
    this.spanEventRecorder = null;
    this.callStack = [];
    this.sequence = 0;
    this.depth = 1;
    this.isRootTrace = true;
    this.transferNs = false;
    this.sampling = sampling;

};

TraceContext.prototype.newTraceObject = function newTraceObject(traceId) {
    this.spanRecorder = new SpanRecorder(traceId);

    //handle data send
    //HANDLE_RETENTION === 0,mean use cls module to handle the data
    if (HANDLE_RETENTION > 0) {
        setTimeout(traceDataSend.bind({traceContext: this}), HANDLE_RETENTION);
    }

    return this.spanRecorder;
};

TraceContext.prototype.continueTraceObject= function continueTraceObject() {
    //user need to set apiId
    this.isRootTrace = false;
    this.spanEventRecorder = new SpanEventRecorder(this.sequence, this.callStack.length + 1, this.spanRecorder.span);
    this.sequence = this.sequence + 1;
    this.callStack.push(this.spanEventRecorder.spanEvent);
    return this.spanEventRecorder;
};

TraceContext.prototype.endTraceObject = function endTraceObject() {
    var now = Date.now();
    this.spanRecorder.span.elapsed = now - this.spanRecorder.span.startTime;
    // if has data ,handle it
    if (this.callStack.length !== 0) {
        var spanEvent = this.callStack.pop();
        //if(spanEvent.sequence != this.sequence - 1){
        //    logger.debug('not matching the span event!'); 
        //}
        spanEvent.endElapsed = now - (spanEvent.startElapsed + this.spanRecorder.span.startTime);
        this.spanRecorder.span.spanEventList.push(spanEvent);
    }
};

TraceContext.prototype.dataSend = function dataSend() {
    try {
        PinpointNodejsAgent.udpSpanClient.send(this.spanRecorder.span);
    } catch(err) {
        logger.info('local process send udp data failed: ' + err); 
    }
};

TraceContext.prototype.isRoot = function isRoot() {
    return this.isRootTrace;
};

TraceContext.prototype.hasInit = function hasInit() {
    return (this.spanRecorder === null) ? false : true;
};

TraceContext.prototype.recordException = function recordException(err) {
    if (this.isRoot() && this.hasInit()) {
        this.spanRecorder.recordException(err) ;
    } else if (!this.isRoot()) {
        this.spanRecorder.span.err = 1;
        this.spanEventRecorder.recordException(err) ;
    } else {
        logger.info('cannot record err,this.spanRecord has not init!');
    }
};

TraceContext.prototype.resetNamespaceTransaction = function resetNamespaceTransaction(traceContext) {
    try {
        var namespace = cls.getNamespace(PinpointTraceMetaData.TRACE_CONTEXT);
        namespace.set(PinpointTraceMetaData.TRANSACTION, traceContext);
    } catch(err) {
        logger.info('reset namespace transaction error' + err); 
    }    
};

TraceContext.prototype.canSampled = function () {
    return this.sampling;
};

/*
 * @deprecate can not work in strict mode
 *
TraceContext.getCallerFunctionName = function getCallerFunctionName() {
    //var CallerId = require('caller-id');
    var callerInfo = CallerId.getData();
    var functionName = callerInfo.functionName; 
    if (functionName != undefined || functionName != null) {
         return functionName.replace(/0/g, '.').replace(/1/g, '-');
    } else {
         return null;
    }
}
*/

function traceDataSend() {
    logger.debug('start analyse trace metadata');
    /* jshint validthis: true */
    var traceContext = this.traceContext;
    if (traceContext) {
        logger.debug('current trace metadata is not undefined');
        //it means the spanevent hang up
        for (var i=0; i<traceContext.callStack.length; i++) {
            //record exception for the last one
            if (i === 0) { 
                traceContext.recordException('time out');
            }
            traceContext.endTraceObject();
        }
        if (TRACE_MANAGER_ENABLE) {
            try {
                var ret = PinpointNodejsAgent.traceManager.send(traceContext.spanRecorder.span);
                if (!ret) {
                    logger.debug('return false when send data to child process');
                }
            } catch(err) {
                logger.error('send trace data to child process failed: ' + err); 
            }
        } else {
            traceContext.dataSend(); 
        }
    } else {
        logger.debug('current trace metadata is undefined');
    }
    
}

/**
 * isSampling means new transaction must be sampled
 *
 * @param isSampling
 * @returns {*}
 */
function traceContextFactory(isSampling) {

  //it must has the namespace because it called after method_interceptor
  var namespace = cls.getNamespace(PinpointTraceMetaData.TRACE_CONTEXT);
  var transaction = namespace.get(PinpointTraceMetaData.TRANSACTION);

  if (!transaction) {
    transaction = new TraceContext(isSampling || PinpointNodejsAgent.sampler.isSampling());
    namespace.set(PinpointTraceMetaData.TRANSACTION, transaction);
  }
  if (!transaction.canSampled()) {
    return null;
  }
  return transaction;
}

module.exports.TraceContext = TraceContext;
module.exports.traceContextFactory = traceContextFactory;
