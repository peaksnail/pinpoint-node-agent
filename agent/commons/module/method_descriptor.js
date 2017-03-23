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
var IdGenerator = require('../../utils/sequence_number_singleton.js');

// change module.module.method() ->
// module/module.method() 
// as java api format class.method()
function formatApiInfo(apiInfo) {
    var index = apiInfo.lastIndexOf('.');
    var classStr = apiInfo.substring(0,index).replace(/\./g,'/');
    var methodStr = apiInfo.substring(index, apiInfo.length);
    return classStr + methodStr;
}

var MethodDescriptor = function MethodDescriptor() {

    var length = arguments.length;
    if (length < 3) {
        throw new Error('invalid arguments, arguments length must >= 3');
    }
    this.parameters = arguments[length - 1]; //the last one
    this.methodName = arguments[length - 2];
    for (var i=0; i<length-2; i++) {
        if (i === 0) {
            this.moduleName = arguments[i];
        }else{
            this.moduleName = this.moduleName + '.' + arguments[i];
        }
    }
    if (this.methodName === null) {
        this.apiInfo = this.moduleName;
    } else {
        this.apiInfo = this.moduleName + '.' + this.methodName;
    }
    //valid apiInfo format
    if (this.apiInfo.match(/\(.*\)/) === null) {
        this.apiInfo += '()';
    }
    //pinpoint web will show the api java class name,
    //so we should change this to adapt
    this.apiInfo = formatApiInfo(this.apiInfo);
    this.apiId = IdGenerator.getSequenceNumber();

};


module.exports = MethodDescriptor;
