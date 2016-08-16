/**
 *
 * method descriptor array generator and cache
 *
 * Date: 2016-05-17 14:50
 * Author: psnail
 *
 */

'use strict';
var MethodDescriptor = require('../commons/module/method_descriptor.js');
var TApiMetaData = require('../thrift/dto/Trace_types.js').TApiMetaData;

var MethodDescriptorGenerator = function MethodDescriptorGenerator() {
    
    this.methodDescriptorList = [];
    if (arguments.length === 1 && (typeof arguments[0]) === 'number') {
        this.apiLevel = arguments[0];
    } else {
        this.apiLevel = 3;//defaul level
    }
};

MethodDescriptorGenerator.prototype.push = function push(moduleName, moduleInstance) {
    if (moduleInstance === undefined) {
        this.buildGlobalMethodDescriptor(moduleName);
    } else {
        this.buildMethodDescriptor(moduleName, moduleInstance, 0);
    }
};

MethodDescriptorGenerator.prototype.getApiId = function getApiId() {
    var args = arguments[0];
    var key = [];
    for (var index in args) {
        key.push(args[index]); 
    }
    var methodDescriptor = this.methodDescriptorList[key.join('.')];
    return (methodDescriptor === undefined) ? -1 : methodDescriptor.apiId;
};

MethodDescriptorGenerator.getApiMetaData = function getApiMetaData(agentId, agentStartTime, methodDescriptor) {
    var apiMetaData = new TApiMetaData();
    apiMetaData.agentId = agentId;
    apiMetaData.agentStartTime = agentStartTime;
    apiMetaData.apiId = methodDescriptor.apiId;
    apiMetaData.apiInfo = methodDescriptor.apiInfo;
    return apiMetaData;
};

MethodDescriptorGenerator.prototype.buildMethodDescriptor = function buildMethodDescriptor(moduleName, moduleInstance, level) {
    if (level < this.apiLevel) {
        level ++;
        //should get all static method and prototype method
        var funcArray = getModuleFunctionList(moduleInstance);
        for (var index in funcArray) {
            var funcName = funcArray[index];
            var funcInstance = getModuleFunction(moduleInstance, funcName);
            if ((typeof funcInstance) === 'function') {
                var parameters = getFunctionParameters(funcInstance);
                var newMethodDescriptor = new MethodDescriptor(moduleName, funcName, parameters);
                this.methodDescriptorList[newMethodDescriptor.apiInfo] = newMethodDescriptor;
                this.buildMethodDescriptor(moduleName + '.' + funcName, funcInstance, level);
            }
        }
    }
};

MethodDescriptorGenerator.prototype.buildGlobalMethodDescriptor = function buildGlobalMethodDescriptor(moduleName) {
    var newMethodDescriptor = new MethodDescriptor(moduleName, null, null);
    this.methodDescriptorList[moduleName] = newMethodDescriptor;
};

/**
 * get static and prototype funcs
 */
var getModuleFunctionList = function getModuleFunctionList(moduleInstance) {
    var funcArray;
    if (moduleInstance.prototype) {
        funcArray = Object.keys(moduleInstance).concat(Object.keys(moduleInstance.prototype));
    } else {
        funcArray = Object.keys(moduleInstance);
    }
    //filter super_ func
    delete funcArray[funcArray.indexOf('super_')];
    return funcArray;
};

var getModuleFunction = function getModuleFunction(moduleInstance, funcName) {
    return (moduleInstance[funcName] === undefined) ? moduleInstance.prototype[funcName] : moduleInstance[funcName];
};

//get method str first line(parameters line)
var getFunctionParameters = function getFunctionParameters(funcInstance) {
    var parameters = funcInstance.toString().split('\n')[0];
    //delete char '}'
    return parameters.substring(0, parameters.length-1);
};

module.exports = MethodDescriptorGenerator;
