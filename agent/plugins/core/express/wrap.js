/**
 *
 * express pinpoint agent plugin
 *
 * Date: 2016-05-31 15:45
 * Author: zengshaojian
 *
 */

'use strict';
var interceptor = require('../../../commons/trace/method_interceptor.js');
var PinpointTraceMetaData = require('../../../utils/constants.js').PinpointTraceMetaData;
var ServiceTypeConstants = require('./express_constants.js').ServiceTypeConstants;
var traceContextFactory = require('../../../commons/trace/trace_context.js').traceContextFactory;

var wrap = function (express) {

  var original_Route = express.Route;

  //var original_Router = express.Router;
  //var original_Router_get = original_Router.get;

  var original_Route_get = original_Route.prototype.get;
  express.Route.prototype.get = function get() {
    var original_callback = arguments[0];

    function express0Route0get(original, proxy, argument) {

      var req = argument[0];
      var res = argument[1];
      var next = argument[2];
      var traceContext = req[PinpointTraceMetaData.TRACE_CONTEXT];
      if (traceContext === undefined) {
        traceContext = traceContextFactory();
      } else {
        //express using req to pass traceContext
        //and then use new namespace to continue to other func
        traceContext.resetNamespaceTransaction(traceContext);
      }
      if (!traceContext) {
        return original.apply(proxy, argument);
      }
      if (traceContext.hasInit()) {
        var spanEventRecorder = traceContext.continueTraceObject();
        spanEventRecorder.recordServiceType(ServiceTypeConstants.express);
        spanEventRecorder.recordApi('express.Route.get');
        spanEventRecorder.recordRpcName(req.originalUrl);
      } else {
        var spanRecorder = traceContext.newTraceObject();
        spanRecorder.recordServiceType(ServiceTypeConstants.express);
        spanRecorder.recordApi('express.Route.get');
        spanRecorder.recordRpcName(req.originalUrl);
      }
      //todo if need,you can judge whether this request come from another node?
      //if yes, you should record endPoint and acceptorHost from $req in spanRecorder
      var ret;
      try {
        var args = [req, res, next];
        ret = original.apply(proxy, args);
        if (res.statusCode !== 200) {
          throw new Error(res.statusCode + ' ' + res.statusMessage);
        }
      } catch (err) {
        traceContext.recordException(err);
      }
      traceContext.endTraceObject();
      return ret;
    }

    var callback = interceptor(original_callback, express0Route0get);
    var args = [callback];
    var ret = original_Route_get.apply(this, args);
    return ret;
  };

  var original_Route_post = original_Route.prototype.post;
  express.Route.prototype.post = function () {

    var original_callback = arguments[0];

    function express0Route0post(original, proxy, argument) {

      var req = argument[0];
      var res = argument[1];
      var next = argument[2];
      var traceContext = req[PinpointTraceMetaData.TRACE_CONTEXT];
      if (traceContext === undefined) {
        traceContext = traceContextFactory();
      } else {
        //express using req to pass traceContext
        //and then use new namespace to continue to other func
        traceContext.resetNamespaceTransaction(traceContext);
      }
      if (!traceContext) {
        return original.apply(proxy, argument);
      }
      if (traceContext.hasInit()) {
        var spanEventRecorder = traceContext.continueTraceObject();
        spanEventRecorder.recordServiceType(ServiceTypeConstants.express);
        spanEventRecorder.recordApi('express.Route.post');
        spanEventRecorder.recordRpcName(req.originalUrl);
      } else {
        var spanRecorder = traceContext.newTraceObject();
        spanRecorder.recordServiceType(ServiceTypeConstants.express);
        spanRecorder.recordApi('express.Route.post');
        spanRecorder.recordRpcName(req.originalUrl);
      }
      var ret;
      try {
        var args = [req, res, next];
        ret = original.apply(proxy, args);
        if (res.statusCode !== 200) {
          throw new Error(res.statusCode + ' ' + res.statusMessage);
        }
      } catch (err) {
        traceContext.recordException(err);
      }
      traceContext.endTraceObject();
      return ret;
    }

    var callback = interceptor(original_callback, express0Route0post);
    var args = [callback];
    var ret = original_Route_post.apply(this, args);
    return ret;
  };


  var original_Route_put = original_Route.prototype.put;
  express.Route.prototype.put = function () {

    var original_callback = arguments[0];

    function express0Route0put(original, proxy, argument) {

      var req = argument[0];
      var res = argument[1];
      var next = argument[2];
      var traceContext = req[PinpointTraceMetaData.TRACE_CONTEXT];
      if (traceContext === undefined) {
        traceContext = traceContextFactory();
      } else {
        //express using req to pass traceContext
        //and then use namespace to continue to other func
        traceContext.resetNamespaceTransaction(traceContext);
      }
      if (!traceContext) {
        return original.apply(proxy, argument);
      }
      if (traceContext.hasInit()) {
        var spanEventRecorder = traceContext.continueTraceObject();
        spanEventRecorder.recordServiceType(ServiceTypeConstants.express);
        spanEventRecorder.recordApi('express.Route.put');
        spanEventRecorder.recordRpcName(req.originalUrl);
      } else {
        var spanRecorder = traceContext.newTraceObject();
        spanRecorder.recordServiceType(ServiceTypeConstants.express);
        spanRecorder.recordApi('express.Route.put');
        spanRecorder.recordRpcName(req.originalUrl);
      }
      var ret;
      try {
        var args = [req, res, next];
        ret = original.apply(proxy, args);
        if (res.statusCode !== 200) {
          throw new Error(res.statusCode + ' ' + res.statusMessage);
        }
      } catch (err) {
        traceContext.recordException(err);
      }
      traceContext.endTraceObject();
      return ret;
    }

    var callback = interceptor(original_callback, express0Route0put);
    var args = [callback];
    var ret = original_Route_put.apply(this, args);
    return ret;
  };

  var original_Route_delete = original_Route.prototype.delete;
  express.Route.prototype.delete = function () {

    var original_callback = arguments[0];

    function express0Route0delete(original, proxy, argument) {

      var req = argument[0];
      var res = argument[1];
      var traceContext = req[PinpointTraceMetaData.TRACE_CONTEXT];
      if (traceContext === undefined) {
        traceContext = traceContextFactory();
      } else {
        //express using req to pass traceContext
        //and then use namespace to continue to other func
        traceContext.resetNamespaceTransaction(traceContext);
      }
      if (!traceContext) {
        return original.apply(proxy, argument);
      }
      if (traceContext.hasInit()) {
        var spanEventRecorder = traceContext.continueTraceObject();
        spanEventRecorder.recordServiceType(ServiceTypeConstants.express);
        spanEventRecorder.recordApi('express.Route.delete');
        spanEventRecorder.recordRpcName(req.originalUrl);
      } else {
        var spanRecorder = traceContext.newTraceObject();
        spanRecorder.recordServiceType(ServiceTypeConstants.express);
        spanRecorder.recordApi('express.Route.delete');
        spanRecorder.recordRpcName(req.originalUrl);
      }
      var ret;
      try {
        ret = original.apply(proxy, argument);
        if (res.statusCode !== 200) {
          throw new Error(res.statusCode + ' ' + res.statusMessage);
        }
      } catch (err) {
        traceContext.recordException(err);
      }
      traceContext.endTraceObject();
      return ret;
    }

    var callback = interceptor(original_callback, express0Route0delete);
    var args = [callback];
    var ret = original_Route_delete.apply(this, args);
    return ret;
  };


  //express application 
  var original_application_handle = express.application.handle;

  function express0application0handle(original, proxy, argument) {
    var req = argument[0];
    var res = argument[1];
    var traceContext = traceContextFactory();
    if (!traceContext) {
      return original.apply(proxy, argument);
    }
    if (traceContext.hasInit()) {
      var spanEventRecorder = traceContext.continueTraceObject();
      spanEventRecorder.recordServiceType(ServiceTypeConstants.express);
      spanEventRecorder.recordApi('express.application.handle');
      spanEventRecorder.recordRpcName(req.url);
    } else {
      return original.apply(proxy, argument);
    }

    req[PinpointTraceMetaData.TRACE_CONTEXT] = traceContext;
    //use req to pass traceContext and tell the cls
    //not record now
    traceContext.transferNs = true;
    argument[0] = req;
    var ret;
    try {
      ret = original.apply(proxy, argument);
      if (res.statusCode !== 200) {
        throw new Error(res.statusCode + ' ' + res.statusMessage);
      }
    } catch (err) {
      traceContext.recordException(err);
    }
    traceContext.endTraceObject();
    return ret;

  }

  express.application.handle = interceptor(original_application_handle, express0application0handle);

  return express;
};


module.exports = wrap;
