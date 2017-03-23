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

var bluebird = require('bluebird');
var os = require('os');
var Configuration = require('../../conf/read_config.js');                                                              
var ConfigConstants = require('../../utils/constants.js').ConfigConstants;
var LoggerFactory = require('../../utils/logger_factory.js');
var pidUsage = require('pidusage');
var schedule = require('node-schedule');
var TAgentStat = require('../../thrift/dto/Pinpoint_types.js').TAgentStat;
var TJvmGc = require('../../thrift/dto/Pinpoint_types.js').TJvmGc;
var TCpuLoad = require('../../thrift/dto/Pinpoint_types.js').TCpuLoad;
var v8 = require('v8');

var conf = new Configuration();
var logger = LoggerFactory.getLogger(__filename);
var interval = conf.get(ConfigConstants.AGENT_STAT_COLLECT_INTERVAL, 10000);
var TRACE_MANAGER_ENABLE = conf.get(ConfigConstants.TRACE_MANAGER_ENABLE, false);

var pid,heap_max_memory,agentId,agentStartTime;
pidUsage = bluebird.promisifyAll(pidUsage);

function createTJvmGc(stat) {
    var tJvmGc = new TJvmGc();
    tJvmGc.type = 0;
    //this is rss
    tJvmGc.jvmMemoryHeapUsed = stat.memory;
    tJvmGc.jvmMemoryHeapMax = heap_max_memory;
    tJvmGc.jvmMemoryNonHeapUsed = 0;
    tJvmGc.jvmMemoryNonHeapMax = 0;
    tJvmGc.jvmGcOldCount = 0;
    tJvmGc.jvmGcOldTime = 0;
    var data = {stat: stat, tJvmGc: tJvmGc};
    return bluebird.resolve(data);
}

function createTCpuLoad(data) {

    var stat = data['stat'];
    var tJvmGc = data['tJvmGc'];
    var tCpuLoad = new TCpuLoad();
    tCpuLoad.jvmCpuLoad = (stat.cpu / 100);
    tCpuLoad.systemCpuLoad = getSystemCpuAvgLoad();

    var data = {tCpuLoad: tCpuLoad, tJvmGc: tJvmGc};
    return bluebird.resolve(data);
}

function createTAgentStat(data) {
    var tAgentStat = new TAgentStat();
    tAgentStat.agentId = agentId;
    tAgentStat.startTimestamp = agentStartTime;
    tAgentStat.timestamp = Date.now();
    tAgentStat.collectInterval = 1000;
    tAgentStat.cpuLoad = data['tCpuLoad'];
    tAgentStat.gc = data['tJvmGc'];
    return bluebird.resolve(tAgentStat);
}

function agentStatMonitor() {
    var udpStatClient = this.udpStatClient;
    pidUsage.statAsync(pid)
        .then(createTJvmGc)
        .then(createTCpuLoad)
        .then(createTAgentStat)
        .then(function (agentStat) {

            logger.debug('send agent stat:' + JSON.stringify(agentStat));
            udpStatClient.send(agentStat);

        })
        .catch(function (err) {
            if (err) {
                logger.error('get agent stat error: ' + err);
            }
        });
}

function agentStatCollector(udpStatClient, pidInfo) {

    var rule = new schedule.RecurrenceRule();
    var times = [];
    for(var i=0; i<60; i+=interval/1000){
    　　times.push(i);
    }
    rule.second = times;

    //set pid info
    if (TRACE_MANAGER_ENABLE) {
        if (pidInfo) {
            pid = pidInfo.pid;
            heap_max_memory = pidInfo.heapMem;
            agentId = pidInfo.agentId;
            agentStartTime = pidInfo.agentStartTime;
            logger.info('get parent process info,pid is: ' + pid + ',heap mem is: ' + heap_max_memory);
        } else {
            logger.info('get parent process info failed,stop stat collector!');
            return;
        }
    } else {
        pid = process.pid; 
        heap_max_memory = (v8.getHeapStatistics())['heap_size_limit'];
        agentId = global.PinpointNodejsAgent.agentId;
        agentStartTime = global.PinpointNodejsAgent.agentStartTime;
        logger.info('get current process info,pid is: ' + pid + ',heap mem is: ' + heap_max_memory);
    }
    schedule.scheduleJob(rule, agentStatMonitor.bind({udpStatClient: udpStatClient}));

}

function getSystemCpuAvgLoad() {

    var cpus = os.cpus();
    var sysTotal = 0;
    for(var i = 0, len = cpus.length; i < len; i++) {

        var cpu = cpus[i], total = 0;
        for(var type in cpu.times) {
            total += cpu.times[type];
        }
        sysTotal += ((total - cpu.times['idle']) / total);
    }

    return sysTotal / cpus.length;
}

module.exports = agentStatCollector;

