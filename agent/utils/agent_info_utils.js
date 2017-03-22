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
var os = require('os');
var TAgentInfo = require('../thrift/dto/Pinpoint_types.js').TAgentInfo;

var AgentInfoUtils = {

    createAgentInfo : function (agentId, applicationName, serviceType, startTimestamp) {
        var agentInfo = new TAgentInfo(); 
        agentInfo.agentId = agentId;
        agentInfo.applicationName = applicationName;
        agentInfo.serviceType = serviceType;
        agentInfo.applicationServiceType = serviceType;
        agentInfo.hostname = os.hostname();
        agentInfo.ip = getLocalRandomIp();
        agentInfo.ports = '1';
        agentInfo.agentVersion = '1';
        agentInfo.pid = process.pid;
        agentInfo.vmVersion = '1';
        agentInfo.startTimestamp = startTimestamp;
        return agentInfo;
    },

    agentInfoSender : function (senderClient, agentInfo) {
        senderClient.send(agentInfo) ;
    },



};

/**
 * get a random local ip if local ip list size >= 2
 */
var getLocalRandomIp = function () {
    var info = os.networkInterfaces();
    var DEFAULT_IP = '127.0.0.1';
    for (var dev in info) {
        for (var i in info[dev]) {
            var details = info[dev][i];
            if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                return details.address;
            }
        }
    
    }
    //not find any ip, use 127.0.0.1
    return DEFAULT_IP;
};


module.exports = AgentInfoUtils;
