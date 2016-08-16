'use strict';

var assert      = require('assert');
var Configuration = require('../../conf/read_config.js');
var Constants = require('../../utils/constants.js').ConfigConstants;
var loggerFactory = require('../../utils/logger_factory.js');
var PinpointTraceMetaData = require('../../utils/constants.js').PinpointTraceMetaData;
var PinpointNodejsAgent = global.PinpointNodejsAgent;
var wrapEmitter = require('emitter-listener');

var conf = new Configuration();
var logger = loggerFactory.getLogger(__filename);

var HANDLE_RETENTION = conf.get(Constants.TRACE_METADATA_RETENTION, 30000);
var TRACE_MANAGER_ENABLE = conf.get(Constants.TRACE_MANAGER_ENABLE, false);

/*
 *
 * CONSTANTS
 *
 */
var CONTEXTS_SYMBOL = 'cls@contexts';
var ERROR_SYMBOL = 'error@context';

// load polyfill if native support is unavailable
if (!process.addAsyncListener) require('async-listener');

function Namespace(name) {
  this.name   = name;
  // changed in 2.7: no default context
  this.active = null;
  this._set   = [];
  this.id     = null;
}

Namespace.prototype.set = function (key, value) {
  if (!this.active) {
    throw new Error("No context available. ns.run() or ns.bind() must be called first.");
  }

  this.active[key] = value;
  return value;
};

Namespace.prototype.get = function (key) {
  if (!this.active) return undefined;

  return this.active[key];
};

Namespace.prototype.createContext = function () {
  return Object.create(this.active);
};

Namespace.prototype.run = function (fn) {
  var context = this.createContext();
  this.enter(context);
  try {
    fn(context);
    return context;
  }
  catch (exception) {
    if (exception) {
      exception[ERROR_SYMBOL] = context;
    }
    throw exception;
  }
  finally {
    this.pinpointExit(context);
  }
};

Namespace.prototype.bind = function (fn, context) {
  if (!context) {
    if (!this.active) {
      context = Object.create(this.active);
    }
    else {
      context = this.active;
    }
  }

  var self = this;
  return function () {
    self.enter(context);
    try {
      return fn.apply(this, arguments);
    }
    catch (exception) {
      if (exception) {
        exception[ERROR_SYMBOL] = context;
      }
      throw exception;
    }
    finally {
      self.pinpointExit(context);
    }
  };
};

Namespace.prototype.enter = function (context) {
  assert.ok(context, "context must be provided for entering");

  this._set.push(this.active);
  this.active = context;
};

Namespace.prototype.pinpointExit = function (context) {
  assert.ok(context, "context must be provided for exiting");

  // Fast path for most exits that are at the top of the stack
  if (this.active === context) {
    assert.ok(this._set.length, "can't remove top context");
    this.active = this._set.pop();
    pinpointTraceDataSend(context);
    return;
  }

  // Fast search in the stack using lastIndexOf
  var index = this._set.lastIndexOf(context);

  assert.ok(index >= 0, "context not currently entered; can't exit");
  assert.ok(index,      "can't remove top context");

  pinpointTraceDataSend(context);
  this._set.splice(index, 1);
};

Namespace.prototype.exit = function (context) {
  assert.ok(context, "context must be provided for exiting");

  // Fast path for most exits that are at the top of the stack
  if (this.active === context) {
    assert.ok(this._set.length, "can't remove top context");
    this.active = this._set.pop();
    return;
  }

  // Fast search in the stack using lastIndexOf
  var index = this._set.lastIndexOf(context);

  assert.ok(index >= 0, "context not currently entered; can't exit");
  assert.ok(index,      "can't remove top context");

  this._set.splice(index, 1);
};

Namespace.prototype.bindEmitter = function (emitter) {
  assert.ok(emitter.on && emitter.addListener && emitter.emit, "can only bind real EEs");

  var namespace  = this;
  var thisSymbol = 'context@' + this.name;

  // Capture the context active at the time the emitter is bound.
  function attach(listener) {
    if (!listener) return;
    if (!listener[CONTEXTS_SYMBOL]) listener[CONTEXTS_SYMBOL] = Object.create(null);

    listener[CONTEXTS_SYMBOL][thisSymbol] = {
      namespace : namespace,
      context   : namespace.active
    };
  }

  // At emit time, bind the listener within the correct context.
  function bind(unwrapped) {
    if (!(unwrapped && unwrapped[CONTEXTS_SYMBOL])) return unwrapped;

    var wrapped  = unwrapped;
    var contexts = unwrapped[CONTEXTS_SYMBOL];
    Object.keys(contexts).forEach(function (name) {
      var thunk = contexts[name];
      wrapped = thunk.namespace.bind(wrapped, thunk.context);
    });
    return wrapped;
  }

  wrapEmitter(emitter, attach, bind);
};

/**
 * If an error comes out of a namespace, it will have a context attached to it.
 * This function knows how to find it.
 *
 * @param {Error} exception Possibly annotated error.
 */
Namespace.prototype.fromException = function (exception) {
  return exception[ERROR_SYMBOL];
};

function get(name) {
  return process.namespaces[name];
}

function create(name) {
  assert.ok(name, "namespace must be given a name!");

  var namespace = new Namespace(name);
  namespace.id = process.addAsyncListener({
    create : function () { return namespace.active; },
    before : function (context, storage) { if (storage) namespace.enter(storage); },
    after  : function (context, storage) { if (storage) namespace.exit(storage); },
    error  : function (storage) { if (storage) namespace.exit(storage); }
  });

  process.namespaces[name] = namespace;
  return namespace;
}

function pinpointTraceDataSend(context) {

    if(HANDLE_RETENTION !== 0){
        return;
    }

    logger.debug('start analyse trace metadata');
    /* jshint validthis: true */
    var traceContext = context[PinpointTraceMetaData.TRANSACTION];
    if(traceContext && traceContext.transferNs === false){
        logger.debug('current trace metadata is not undefined');
        for(var i=0; i<traceContext.callStack.length; i++){
            traceContext.endTraceObject();
        }
        if(TRACE_MANAGER_ENABLE){
            try{
                var ret = PinpointNodejsAgent.traceManager.send(traceContext.spanRecorder.span);
                if(!ret){
                    logger.debug('return false when send data to child process');
                }
            }catch(err){
                logger.error('send trace data to child process failed: ' + err); 
            }
        }else{
            traceContext.dataSend(); 
        }
    }else if(traceContext && traceContext.transferNs === true){
        logger.debug('ignore current traceContext because of transferNs');
        traceContext.transferNs = false;
    }else{
        logger.debug('current trace metadata is undefined');
    }
    
}

function destroy(name) {
  var namespace = get(name);

  assert.ok(namespace,    "can't delete nonexistent namespace!");
  assert.ok(namespace.id, "don't assign to process.namespaces directly!");

  process.removeAsyncListener(namespace.id);
  process.namespaces[name] = null;
}

function reset() {
  // must unregister async listeners
  if (process.namespaces) {
    Object.keys(process.namespaces).forEach(function (name) {
      destroy(name);
    });
  }
  process.namespaces = Object.create(null);
}
if (!process.namespaces) reset(); // call immediately to set up

module.exports = {
  getNamespace     : get,
  createNamespace  : create,
  destroyNamespace : destroy,
  reset            : reset
};
