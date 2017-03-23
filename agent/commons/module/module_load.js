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
var fs = require('fs');
var loggerFactory = require('../../utils/logger_factory.js');
var _module = require('module');
var MethodDescriptorGenerator = require('../../utils/method_descriptor_generator.js');
var path = require('path');
var PinpointGlobalMethod = require('../../utils/constants.js').PinpointGlobalMethod;
var PluginObject = require('./plugin_object.js');

var original_load = _module._load;
var COREPLUGINDIRNAME = '../../plugins/core';
var USERPLUGINDIRNAME = '../../plugins/user';
var COREPLUGINSPATH = path.join(__dirname, path.sep, COREPLUGINDIRNAME);
var USERPLUGINSPATH = path.join(__dirname, path.sep, USERPLUGINDIRNAME);
var logger = loggerFactory.getLogger(__filename);

//get plugins object
var getPluginsObject = function () {
    var moduleKeyMap = {};
    var pluginType = [COREPLUGINSPATH, USERPLUGINSPATH];
    for (var index in pluginType) {
        var type = pluginType[index];
        /* jshint loopfunc: true */
        fs.readdirSync(type).forEach(function (item) {
            var pluginPath  = path.join(type, path.sep, item);
               if (fs.lstatSync(pluginPath).isDirectory()) {
                   var pluginObject = new PluginObject(pluginPath); 
                   for (var module in pluginObject.requireModule) {
                       moduleKeyMap[module] = pluginObject;
                   }
               }
        }); 
    }
    return moduleKeyMap;
};

var moduleMap = getPluginsObject();
var haveLoaded = {};

//hack the module load function
_module._load = function () {

    //refresh module paths
    arguments[1].paths = [].concat(arguments[1].paths,
            global.projectModulePaths.filter( function (item) {
                return this.paths.indexOf(item) < 0; 
            }.bind({paths: arguments[1].paths})));
    var module_name = arguments[0];
    var parent = arguments[1];
    var instance;

    //is core plugin
    var key = module_name;
    //is user plugin
    if (module_name.startsWith('.') || module_name.startsWith('/')) {
        var filename = _module._resolveFilename(module_name, parent);
        key = filename;
    }
    if (key in haveLoaded) {
        instance = haveLoaded[key];
    } else if (key in moduleMap) {
        logger.info('add plugin for ' + key);
        var pluginObject = moduleMap[key];
        var wrap = require(pluginObject.getPluginFile(key));
        instance = original_load.apply(this, arguments);
        instance = wrap(instance);
        haveLoaded[key] = instance;
    } else {
        //normal module
        //cache every module,that agent and user app share the common module
        instance = original_load.apply(this, arguments);
        haveLoaded[key] = instance;
    }

    return instance;
};

//load all plugins api info
//todo send api info when load
var loadPluginsApiDetails = function loadPluginsApiDetails() {

    var methodDescriptorGenerator = new MethodDescriptorGenerator();
    var item;
    for (item in moduleMap) {
        var apiList = require(moduleMap[item].apiInfoFile);
        for (var api in apiList) {
            methodDescriptorGenerator.push(api);
        }
    }
    //load global method
    for (item in PinpointGlobalMethod) {
        methodDescriptorGenerator.push(PinpointGlobalMethod[item]);
    }
    return methodDescriptorGenerator;
};

module.exports.loadPluginsApiDetails = loadPluginsApiDetails;
