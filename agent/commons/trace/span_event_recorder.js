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
var PinpointNodejsAgent = global.PinpointNodejsAgent;
var TSpanEvent = require('../../thrift/dto/Trace_types.js').TSpanEvent;
var TAnnotation = require('../../thrift/dto/Trace_types.js').TAnnotation;
var TAnnotationValue = require('../../thrift/dto/Trace_types.js').TAnnotationValue;
var TIntStringValue = require('../../thrift/dto/Trace_types.js').TIntStringValue;

var SpanEventRecorder = function SpanEventRecorder(sequence, depth, span) {
    this.spanEvent = new TSpanEvent();
    this.spanEvent.sequence = sequence;
    this.spanEvent.depth = depth;
    this.spanEvent.startElapsed = Date.now() - span.startTime;
    this.spanEvent.annotations = [];
};

SpanEventRecorder.prototype.recordApi = function recordApi(functionName) {
    this.spanEvent.apiId = PinpointNodejsAgent.getApiId(functionName);
};

SpanEventRecorder.prototype.recordServiceType = function recordServiceType(serviceType) {
    this.spanEvent.serviceType = serviceType;
};

SpanEventRecorder.prototype.recordEndPoint = function recordEndPoint(endPoint) {
    this.spanEvent.endPoint = endPoint;
};

SpanEventRecorder.prototype.recordAttribute = function recordAttribute(annotationKey, value) {
    var tAnnotation = new TAnnotation();
    tAnnotation.key = annotationKey;
    tAnnotation.value = new TAnnotationValue();
    switch (typeof value) {
        case 'boolean':
            tAnnotation.value.boolValue = value;
            break;
        case 'number':
            tAnnotation.value.intValue = value;
            break;
        case 'string':
            tAnnotation.value.stringValue = value;
            break;
        case 'undefined':
            tAnnotation.value.stringValue = 'undefined';
            break;
        default:
            throw new Error('Tbase not supported: '+ value);
    }
    this.spanEvent.annotations.push(tAnnotation);
};

SpanEventRecorder.prototype.recordDestinationId = function recordDestinationId(destinationId) {
    this.spanEvent.destinationId = destinationId;
};

SpanEventRecorder.prototype.recordRpcName = function recordRpcName(rpc) {
    this.spanEvent.rpc = rpc;
};

SpanEventRecorder.prototype.recordNextSpanId = function recordNextSpanId(nextSpanId) {
    this.spanEvent.nextSpanId = nextSpanId;
};

SpanEventRecorder.prototype.recordException = function recordException(err) {
    //recorder err and exception(int string)
    var intStringValue = new TIntStringValue();
    intStringValue.intValue = err.length;
    intStringValue.stringValue = err.toString();
    this.spanEvent.exceptionInfo = intStringValue;
};
SpanEventRecorder.prototype.resetSpanEvent = function resetSpanEvent(spanEventMap) {
    for (var key in spanEventMap) {
        if (spanEventMap[key]) {
            this.spanEvent[key] = spanEventMap[key]; 
        }
    }

};

module.exports = SpanEventRecorder;
