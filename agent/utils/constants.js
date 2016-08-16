/**
 *
 * constants file
 *
 * Date: 2016-05-06 15:50
 * Author: psnail
 *
 */

'use strict';
/**
 * constants for configuration
 */
var ConfigConstants = {

    PROFILER_COLLECTOR_IP : 'profiler.collector.ip',
    PROFILER_COLLECTOR_SPAN_PORT : 'profiler.collector.span.port',
    PROFILER_COLLECTOR_TCP_PORT : 'profiler.collector.tcp.port',
    PROFILER_COLLECTOR_SPAN_STAT_PORT : 'profiler.collector.stat.port',
    AGENT_ID : 'agent.id',
    AGENT_APPLICATION_NAME : 'agent.application.name',
    AGENT_SERVICE_TYPE : 'agent.service.type',
    TRACE_METADATA_RETENTION : 'trace.metadata.retention',
    TRACE_MANAGER_ENABLE : 'trace.manager.enable',

    //todo add more constants

};

var PinpointConstants = {
    
    MAX_AGENT_ID_LENGTH : 24,
    MAX_APPLICATION_NAME_LENGTH : 24,

};

var PinpointMetaData = {
    TRANSACTION_ID: 'TRANSACTION_ID',
    SPAN_ID: 'SPAN_ID',
    PARENT_SPAN_ID: 'PARENT_SPAN_ID',
    FLAG: 'FLAG',
    PARENT_APPLICATION_NAME: 'PARENT_APPLICATION_NAME',
    PARENT_APPLICATION_TYPE: 'PARENT_APPLICATION_TYPE',
    PINPOINT_METADATA: 'PINPOINT_METADATA',
    ENDPOINT: 'ENDPOINT',
    REMOTEADDRESS: 'REMOTEADDRESS',
    ACCEPTORHOST: 'ACCEPTORHOST',
};

var PinpointTraceMetaData = {
    TRACE_CONTEXT: 'TRACE_CONTEXT',
    TRANSACTION: 'TRANSACTION',
};

var PinpointGlobalMethod = {
    CALLBACK: 'callback',
    RABBITMQCLIENT: 'rabbitMQClient'
};

exports.ConfigConstants = ConfigConstants;
exports.PinpointConstants = PinpointConstants;
exports.PinpointMetaData = PinpointMetaData;
exports.PinpointTraceMetaData = PinpointTraceMetaData;
exports.PinpointGlobalMethod = PinpointGlobalMethod;
