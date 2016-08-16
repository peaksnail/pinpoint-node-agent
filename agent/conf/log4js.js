'use strict';

var constants = require('../utils/constants.js').ConfigConstants;
var Configuration = require('./read_config.js');
var fs = require('fs');
var path = require('path');

var config = new Configuration();
var logPathPrefix = __dirname.substring(0, __dirname.lastIndexOf(path.sep));
var defaultCategory= config.get(constants.AGENT_APPLICATION_NAME, 'node-app-id');
var defaultLogPath= path.join(logPathPrefix, path.sep, '/logs');

function mkdirLogDir() {
    if (!fs.existsSync(defaultLogPath)) {
        fs.mkdirSync(defaultLogPath);        
    }
}

mkdirLogDir();

//set replaceConsole=true, levels=INFO when in online/product

module.exports = {
 
  defaultLogPath: defaultLogPath,
  defaultCategory: defaultCategory,
  replaceConsole: false,
  appenders: [
    //don't use console, because the app may use it
    //{
    //  type: 'dateFile',
    //  category: 'console'
    //},
    {
      type: 'dateFile',
      category: defaultCategory
    }
  ],
  levels: {
    //console: 'DEBUG',
    [defaultCategory]: 'DEBUG'
  }
};
