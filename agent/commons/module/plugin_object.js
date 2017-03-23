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
var path = require('path');

var APIFILE = 'api.js';
var REQUIREFILE = 'require.js';

var PluginObject = function (pluginPath) {

    this.pluginName = pluginPath;
    this.apiInfoFile = path.join(pluginPath, path.sep, APIFILE);
    this.pluginPath = pluginPath;
    this.requireModule = require(path.join(pluginPath,  path.sep, REQUIREFILE));
};

PluginObject.prototype.getPluginFile = function getPluginFile(module) {
    return path.join(this.pluginPath, path.sep, this.requireModule[module]);
};

module.exports = PluginObject;
