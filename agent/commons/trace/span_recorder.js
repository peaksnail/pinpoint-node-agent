/**
 *
 * trace span recorder 
 *
 * Date: 2016-05-20 9:40
 * Author: psnail
 *
 */

'use strict';
var IdGenerator = require('../../utils/id_generator.js');
var PinpointNodejsAgent = global.PinpointNodejsAgent;
var PinpointMetaData = require('../../utils/constants.js').PinpointMetaData;
var SequenceNumberSingleton = require('../../utils/sequence_number_singleton.js');
var TransactionId = require('./transaction_id.js');
var TransactionIdUtil = require('../../utils/transaction_id_util.js');
var TSpan = require('../../thrift/dto/Trace_types.js').TSpan;
var TSpanEvent = require('../../thrift/dto/Trace_types.js').TSpanEvent;
var TIntStringValue = require('../../thrift/dto/Trace_types.js').TIntStringValue;
var TAnnotation = require('../../thrift/dto/Trace_types.js').TAnnotation;
var TAnnotationValue = require('../../thrift/dto/Trace_types.js').TAnnotationValue;


var SpanRecorder = function SpanRecorder(traceId) {
    this.createNewSpan(traceId);
};

//SpanRecorder.prototype.doInBeforeTrace = function doInBeforeTrace(){
//
//    //to set transaction id, parent span id, applicationServiceType, serviceType etc.
//    if(arguments[0] != undefined){
//        //arguments0] is map for span data
//        this.resetSpan(arguments[0]);
//    }
//}

SpanRecorder.prototype.recordApi = function recordApi(functionName) {
    this.span.apiId = PinpointNodejsAgent.getApiId(functionName);
};

SpanRecorder.prototype.createNewSpan = function createNewSpan(traceId) {

    var span = new TSpan();
    span.agentId = PinpointNodejsAgent.agentId;
    span.applicationName = PinpointNodejsAgent.applicationName;
    span.agentStartTime = PinpointNodejsAgent.agentStartTime;
    span.startTime = Date.now();
    span.serviceType = 0;
    span.applicationServiceType = PinpointNodejsAgent.serviceType;
    span.annotations = [];
    span.spanEventList = [];
    if (traceId) {
        span.spanId = traceId.spanId;
        span.parentSpanId = traceId.parentSpanId;
        span.flag = traceId.flag;
        this.transactionId = TransactionIdUtil.toTransactionId(traceId.transactionId);
    } else {
        span.spanId = IdGenerator.get();
        span.parentSpanId = -1;
        span.flag = 0;
        //span.transactionId = new TransactionId(span.agentId, span.applicationName, SequenceNumberSingleton.getSequenceNumber());
        //convert to bytes to transport
        var seq = SequenceNumberSingleton.getSequenceNumber();
        this.transactionId = new TransactionId(span.agentId, span.agentStartTime, seq);
    }
    span.transactionId = TransactionIdUtil.formatBytes(this.transactionId);
    this.span = span;
};

SpanRecorder.prototype.getNextSpanId = function getNextSpanId() {
    this.nextSpanId = SequenceNumberSingleton.getSequenceNumber();
    return this.nextSpanId;
};

SpanRecorder.prototype.getNextSpanHeader = function getNextSpanHeader() {
    var header = {};
    header[PinpointMetaData.TRANSACTION_ID] = this.transactionId.toString();
    header[PinpointMetaData.SPAN_ID] = this.getNextSpanId();
    header[PinpointMetaData.PARENT_SPAN_ID] = this.span.spanId;
    header[PinpointMetaData.PARENT_APPLICATION_NAME] = this.span.applicationName;
    header[PinpointMetaData.FLAG] = this.span.flag;
    header[PinpointMetaData.PARENT_APPLICATION_TYPE] = PinpointNodejsAgent.serviceType;
    return header;
};

SpanRecorder.prototype.recordServiceType = function recordServiceType(serviceType) {
    if (this.span === undefined) {
        throw new Error('you should call doInBeforeTrace() before set service type!');
    } else {
        this.span.serviceType = serviceType;
    }
};

SpanRecorder.prototype.recordEndPoint = function recordEndPoint(endPoint) {
    this.span.endPoint = endPoint;
};

SpanRecorder.prototype.recordRemoteAddress = function recordRemoteAddress(remoteAddr) {
    this.span.remoteAddr = remoteAddr;
};

SpanRecorder.prototype.recordParentApplication = function recordParentApplication(name, type) {
    this.span.parentApplicationName = name;
    this.span.parentApplicationType = type;
};

SpanRecorder.prototype.recordAcceptorHost = function recordAcceptorHost(acceptorHost) {
    this.span.acceptorHost = acceptorHost;
};

SpanRecorder.prototype.recordRpcName = function recordRpcName(rpcName) {
    this.span.rpc = rpcName;
};

SpanRecorder.prototype.recordAttribute = function recordAttribute(annotationKey, value) {
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
    this.span.annotations.push(tAnnotation);
};

//SpanRecorder.prototype.doInAfterTrace = function doAfterTrace(){
//    this.span.elapsed = Date.now() - this.span.startTime; 
//    //var endElapsed = Date.now() - (this.span.spanEventList[0].startElapsed + this.span.startTime);
//    //if(endElapsed != 0){
//    //    this.span.spanEventList[0].endElapsed =  endElapsed;
//    //}
//    PinpointNodejsAgent.udpSpanClient.send(this.span);
//}

SpanRecorder.prototype.setSpanEvent = function setSpanEvent() {
    var spanEvent = new TSpanEvent();
    spanEvent.sequence = 0;
    //spanEvent.serviceType = 9902;
    spanEvent.depth = 1;
    spanEvent.startElapsed = Date.now() - this.span.startTime;
    //spanEvent.endElapsed = 7;
    spanEvent.nextSpanId = this.getNextSpanId();
    //spanEvent.endPoint = 'angelia';
    this.span.spanEventList.push(spanEvent);
};

SpanRecorder.prototype.recordException = function recordException(err) {
    //recorder err and exception(int string)
    this.span.err = 1;
    var intStringValue = new TIntStringValue();
    intStringValue.intValue = err.length;
    intStringValue.stringValue = err.toString();
    this.span.exceptionInfo = intStringValue;
};

SpanRecorder.prototype.resetSpan = function resetSpan(spanMap) {
    for (var key in spanMap) {
        //specila for pinpoint metadata
        if (key === PinpointMetaData.PINPOINT_METADATA) {
            this.resetSpan(spanMap[key]);
        }
        else if (spanMap[key]) {
            this.span[key] = spanMap[key]; 
        }
    }
};


module.exports = SpanRecorder;
