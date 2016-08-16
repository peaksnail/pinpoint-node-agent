/*
 * method interceptor wrap
 *
 *
 * Date: 2016-07-05
 * Author: psnail
 *
 */

'use strict';
var cls= require('continuation-local-storage');
var PinpointTraceMetaData = require('../../utils/constants.js').PinpointTraceMetaData;
var TRACE_CONTEXT = PinpointTraceMetaData.TRACE_CONTEXT;

function getCurrentNamespace() {
    var namespace = cls.getNamespace(TRACE_CONTEXT);
    if (namespace === undefined) {
        namespace = cls.createNamespace(TRACE_CONTEXT);
    }
    return namespace;
}

function slice(args) {
    var array = [];
    for (var i=0; i<args.length; i++) {
        array[i] = args[i];
    }
    return array; 
}

module.exports = function methodInterceptor(original, wrapper) {
    var method = function originalWrapper() {
        var proxy = this;
        var args = slice(arguments);
        var namespace = getCurrentNamespace();
        if (namespace.active !== null) { 
            return wrapper(original, proxy, args);
        } else {
            //change namespace.active null to some value
            namespace.run(function cb() {
                return wrapper(original, proxy, this.args);
           }.bind({args: args}));  
        }
    };
    return method;
};
