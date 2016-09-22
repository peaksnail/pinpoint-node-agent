/**
 *
 * agent for node js 
 *
 * Date: 2016-05-13 22:30
 * Author: psnail
 *
 */

'use strict';
var Agent = require('./agent/commons/agent.js');
var Configuration = require('./agent/conf/read_config.js');

//get agent conf 
var conf =  new Configuration();
var defaultAgent = new Agent(conf);
global.PinpointNodejsAgent = defaultAgent;


//start agent socket client 
defaultAgent.startTcpClient();
defaultAgent.startUdpClient();

//start send agentInfo
defaultAgent.sendAgentInfo();

//start hack load and load plugins
defaultAgent.hackModuleLoad();

//start to send api info
defaultAgent.sendApiInfo();

//start trace manager
defaultAgent.startTraceManager();

//start agent stat collector
defaultAgent.startAgentStatCollector();

module.exports = {};
