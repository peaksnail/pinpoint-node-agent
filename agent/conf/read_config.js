/**
 *
 * read config file
 *
 * Date: 2016-05-05 20:00
 * Author: psnail
 *
 */

'use strict';

var fs = require('fs');
var path = require('path');

var defaultConfFile = path.join(__dirname, 'pinpoint.config');

function Configuration(confFile) {
    if (confFile === null || confFile === undefined) {
        this.confFile = defaultConfFile;
    } else {
        this.confFile = confFile;
    }
    this.conf = getConfig(this.confFile);
}

Configuration.prototype.get = function(key, defaultValue) {
    if (this.conf[key] === 'false' || this.conf[key] === 'true') {
        this.conf[key] = JSON.parse(this.conf[key]);
    } else if (! isNaN(this.conf[key])) {
        this.conf[key] = Number(this.conf[key]);
    }
    return this.conf[key] === undefined ? defaultValue : this.conf[key];
};

Configuration.prototype.getConfig = function () {
    return this.conf;
};

var getConfig = function (confFile) {
    var data = fs.readFileSync(confFile, 'utf-8').split('\n');
    return handleConfData(data);
};

var handleConfData = function (data) {

    var conf = [];

    data.forEach(function (item) {

        var commentIndex = item.indexOf('#');
        if (commentIndex !== 0 && item.length !== 0) {
            //filter '#' after conf item
            if (commentIndex > 0) {
                item = item.split('#')[0];
            }
            var keyValue = item.split('=');
            keyValue[0] = keyValue[0].trim();
            if (keyValue[1] !== undefined && keyValue[1] !== null) {
                keyValue[1] = keyValue[1].trim();
            }
            if (keyValue[1] !== undefined && keyValue[1] !== null && keyValue[1][0] === '$') {
                conf[keyValue[0]] = getVariable(conf, keyValue[1]);
            }
            else {
                conf[keyValue[0]] = keyValue[1];
            }
        }
    });

    return conf;
};


/*
 * get variable as conf value like key=${value}, we should search value as key in conf
 *
 */
var getVariable = function (conf, key) {

    var value = '';
    //get key
    key = key.trim();
    if (key && key.length !==0) {
       key = key.substr(2, key.length - 3); //remove char '${}' 
       value = (conf[key] !== undefined) ? conf[key] : '';
    }
    return value;
};


module.exports = Configuration;
