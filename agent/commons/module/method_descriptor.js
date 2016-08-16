/**
 *
 * method descriptor
 *
 * Date: 2016-05-17 14:20
 * Author: psnail
 *
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
