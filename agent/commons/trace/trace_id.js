/**
 *
 * trace id
 * 
 * Date: 2016-06-21 15:45
 * Author: psnail
 *
 */

'use strict';

var TraceId = function TraceId() {
    if (arguments.length !== 4) {
        throw Error('arguments need (transactionId, parentSpanId, spanId, flag)');
    }
    //all type is string
    this.transactionId = arguments[0];
    this.parentSpanId = arguments[1];
    this.spanId = arguments[2];
    this.flag = arguments[3];
};

module.exports = TraceId;
