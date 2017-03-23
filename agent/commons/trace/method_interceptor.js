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
var cls= require('../cls');
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
