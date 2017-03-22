/*
 * Copyright 2017 dmb.star-net.cn Corp.
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

//get project module paths
global.projectModulePaths = module.parent ? module.parent.paths : [];

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

//load sampler
defaultAgent.loadSampler();

//start agent stat collector
//
defaultAgent.startAgentStatCollector();

module.exports = {};
