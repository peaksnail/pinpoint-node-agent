/**
 *
 * agent for node js 
 *
 * Date: 2016-05-13 22:30
 * Author: psnail
 *
 */

'use strict';
var AgentInfoUtils = require('../utils/agent_info_utils.js');
var Configuration = require('../conf/read_config.js');
var ConfigConstants = require('../utils/constants.js').ConfigConstants;
var cp = require('child_process');
var LoggerFactory = require('../utils/logger_factory.js');
var MethodDescriptorGenerator = require('../utils/method_descriptor_generator.js');
var path = require('path');
var PacketUtil = require('../utils/packet_util.js');
var SerializeFactory = require('../thrift/io/serialize.js');
var UdpClient = require('../socket/udp_client.js');
var TcpClient = require('../socket/tcp_client.js');


var logger = LoggerFactory.getLogger(__filename);

var Agent = function (conf) {

    if (conf === undefined) {
        conf = new Configuration();
    }
    this.collectorIp = conf.get(ConfigConstants.PROFILER_COLLECTOR_IP, '127.0.0.1');
    this.collectorSpanPort = conf.get(ConfigConstants.PROFILER_COLLECTOR_SPAN_PORT, '9996');
    this.collectorTcpPort = conf.get(ConfigConstants.PROFILER_COLLECTOR_TCP_PORT, '9994');
    this.collectorSpanStatPort = conf.get(ConfigConstants.PROFILER_COLLECTOR_SPAN_STAT_PORT, '9995');
    this.traceManagerEnable = conf.get(ConfigConstants.TRACE_MANAGER_ENABLE, false);
    this.conf = conf;
    this.agentId = conf.get(ConfigConstants.AGENT_ID, 'node-app-id');
    this.applicationName = conf.get(ConfigConstants.AGENT_APPLICATION_NAME, 'node-app-name');
    this.serviceType = conf.get(ConfigConstants.AGENT_SERVICE_TYPE, '1000');
    this.agentStartTime = Date.now();
    this.tcpClient = null;
    this.udpSpanClient = null;
    this.udpSpanStatClient = null;
    logger.info('start pinpoint node agent');
};

Agent.prototype.hackModuleLoad = function () {
    logger.info('start to hack module load');
    var load = require('./module/module_load.js');
    this.methodDescriptorGenerator = load.loadPluginsApiDetails();
};

Agent.prototype.startTcpClient = function () {
    logger.info('init tcp client');
    this.tcpClient = new TcpClient(this.collectorIp, this.collectorTcpPort);
    this.tcpClient.setSerialize(new SerializeFactory());
    this.tcpClient.connect(PacketUtil.PacketDecode);
};

Agent.prototype.startUdpClient = function () {
    if (!this.traceManagerEnable) {
        logger.info('init udp client in local process');
        this.udpSpanClient = new UdpClient(this.collectorIp, this.collectorSpanPort);
        this.udpSpanStatClient = new UdpClient(this.collectorIp, this.collectorSpanStatPort);
        this.udpSpanClient.setSerialize(new SerializeFactory());
        this.udpSpanStatClient.setSerialize(new SerializeFactory());
    }
};

Agent.prototype.sendAgentInfo = function () {
    logger.info('sending agent info to collector');
    var agentInfo = AgentInfoUtils.createAgentInfo(this.agentId, this.applicationName, this.serviceType, this.agentStartTime);
    logger.debug('agent info: ' + JSON.stringify(agentInfo));
    this.agentIp = agentInfo.ip;
    this.agentHostname = agentInfo.hostname;
    AgentInfoUtils.agentInfoSender(this.tcpClient, agentInfo);
};

Agent.prototype.sendApiInfo = function () {
    logger.info('sending api info to collector');
    var apiInfoList = this.methodDescriptorGenerator.methodDescriptorList;
    for (var item in apiInfoList) {
        var apiInfo = MethodDescriptorGenerator.getApiMetaData(this.agentId, this.agentStartTime, apiInfoList[item]); 
        logger.debug('api info: ' + JSON.stringify(apiInfo));
        this.tcpClient.send(apiInfo);
    }
};

Agent.prototype.getApiId = function () {
    return (this.methodDescriptorGenerator === undefined) ? -1 : this.methodDescriptorGenerator.getApiId(arguments);
};

Agent.prototype.startTraceManager = function () {
    if (this.traceManagerEnable) {
        logger.info('start fork trace manager');
        this.traceManager = cp.fork(path.join(__dirname, 'trace', 'trace_manager.js'));
    }
};



module.exports = Agent;
