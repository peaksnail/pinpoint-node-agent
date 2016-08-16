/**
 *
 * plugins object
 *
 * Date: 2016-06-02 9:40
 * Author: psnail
 *
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
