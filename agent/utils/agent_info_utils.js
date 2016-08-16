/**
 *
 * Agent info tools
 *
 * Date: 2016-05016 16:50
 * Author: psnail
 *
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
