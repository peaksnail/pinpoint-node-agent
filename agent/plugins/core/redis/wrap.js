/**
 *
 * redis module wrap
 *
 * Date: 2016-06-16 18:00
 * Author: zengshaojian
 *
 */

'use strict';
var AnnotationConstants = require('./constants.js').AnnotationConstants;
var cls = require('../../../commons/cls');
var interceptor = require('../../../commons/trace/method_interceptor.js');
var PluginConstants = require('./constants.js').PluginConstants;
var PinpointTraceMetaData = require('../../../utils/constants.js').PinpointTraceMetaData;
var RedisUtil = require('../../../utils/sql/redis_util.js');
var ServiceTypeConstants = require('./constants.js').ServiceTypeConstants;
var traceContextFactory = require('../../../commons/trace/trace_context.js').traceContextFactory;

var wrap = function (redis) {

  //the last version 2.6.2
  var originalInternalSendCommand = redis.RedisClient.prototype.internal_send_command;
  //destinationdId is redis, need record in span event
  function internalSendCommand(original, proxy, argument) {
    var commandObj = argument[0];
    var originalCb = commandObj.callback;
    var traceContext = traceContextFactory();
    if (!traceContext) {
      return original.apply(proxy, argument);
    }
    var spanRecorder = traceContext.spanRecorder;
    if (!traceContext.hasInit()) {
      //redis must be a spanEvent because it's a terminal/destinationId
      //so we don't trace here
      return original.apply(proxy, argument);
    }

    var spanEventRecorder = traceContext.continueTraceObject();
    spanEventRecorder.recordServiceType(ServiceTypeConstants.redisServiceType);
    spanEventRecorder.recordApi('redis.RedisClient.prototype.internal_send_command');
    spanEventRecorder.recordAttribute(AnnotationConstants.sql, RedisUtil.getSqlString(commandObj.command, commandObj.args));
    spanEventRecorder.recordDestinationId(PluginConstants.destinationId);
    var ns = cls.getNamespace(PinpointTraceMetaData.TRACE_CONTEXT);

    function redis0command0callback() {

      //there has spanevent in callstack,record exception for spanevent
      if (arguments[0] instanceof Error) {
        traceContext.recordException(arguments[0]);
      }

      if (originalCb && (typeof originalCb) === 'function') {
        /* jshint validthis: true */
        originalCb = ns.bind(originalCb);
        var cbSpanEventRecorder = traceContext.continueTraceObject();
        cbSpanEventRecorder.recordServiceType(ServiceTypeConstants.callback);
        cbSpanEventRecorder.recordApi('redis.command.command_cb');
        var ret = originalCb.apply(this, arguments);
        traceContext.endTraceObject();
        return ret;
      }
    }

    commandObj.callback = ns.bind(redis0command0callback);
    var args = [commandObj];
    var ret = original.apply(proxy, args);
    //specila handler: record time consumption for sql exec
    spanEventRecorder.recordAttribute(AnnotationConstants.sqlSpeed, 'time consumption=' +
      (Date.now() - spanRecorder.span.startTime - spanEventRecorder.spanEvent.startElapsed)
    );
    traceContext.endTraceObject();
    return ret;
  }

  redis.RedisClient.prototype.internal_send_command = interceptor(originalInternalSendCommand, internalSendCommand);

  //the old version 2.4.2
  var originalSendCommand = redis.RedisClient.prototype.send_command;
  //destinationdId is redis, need record in span event
  function sendCommand(original, proxy, argument) {

    var command = argument[0];
    var originalArgs = argument[1];
    var originalCb = argument[2];
    var traceContext = traceContextFactory();
    if (!traceContext) {
      return original.apply(proxy, argument);
    }
    var spanRecorder = traceContext.spanRecorder;
    if (!traceContext.hasInit()) {
      //redis must be a spanEvent because it's a terminal/destinationId
      //so we don't trace here
      return original.apply(proxy, argument);
    }
    //get the real callback
    if (originalArgs === undefined) {
      originalArgs = [];
    } else if (!originalCb) {
      if (typeof originalArgs[originalArgs.length - 1] === 'function') {
        originalCb = originalArgs.pop();
      } else if (typeof originalArgs[originalArgs.length - 1] === 'undefined') {
        originalArgs.pop();
      }
    }

    var spanEventRecorder = traceContext.continueTraceObject();
    spanEventRecorder.recordServiceType(ServiceTypeConstants.redisServiceType);
    spanEventRecorder.recordApi('redis.RedisClient.prototype.send_command');
    spanEventRecorder.recordAttribute(AnnotationConstants.sql, RedisUtil.getSqlString(command, originalArgs));
    spanEventRecorder.recordDestinationId(PluginConstants.destinationId);
    var ns = cls.getNamespace(PinpointTraceMetaData.TRACE_CONTEXT);

    function redis0command0callback() {

      //there has spanevent in callstack,record exception for spanevent
      if (arguments[0] instanceof Error) {
        traceContext.recordException(arguments[0]);
      }

      if (originalCb && (typeof originalCb) === 'function') {
        /* jshint validthis: true */
        originalCb = ns.bind(originalCb);
        var cbSpanEventRecorder = traceContext.continueTraceObject();
        cbSpanEventRecorder.recordServiceType(ServiceTypeConstants.callback);
        cbSpanEventRecorder.recordApi('redis.command.callback');
        var ret = originalCb.apply(this, arguments);
        traceContext.endTraceObject();
        return ret;
      }
    }

    redis0command0callback = ns.bind(redis0command0callback);
    var args = [command, originalArgs, redis0command0callback];
    var ret = original.apply(proxy, args);
    //specila handler: record time consumption for sql exec
    spanEventRecorder.recordAttribute(AnnotationConstants.sqlSpeed, 'time consumption=' +
      (Date.now() - spanRecorder.span.startTime - spanEventRecorder.spanEvent.startElapsed)
    );
    traceContext.endTraceObject();
    return ret;
  }

  //redis.RedisClient.prototype.send_command = interceptor(originalSendCommand, sendCommand);

  return redis;
};


module.exports = wrap;
