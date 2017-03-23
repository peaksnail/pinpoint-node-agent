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
var header = require('./header.js');
var traceTBase = require('../dto/Trace_types.js');
var pinpointTBase = require('../dto/Pinpoint_types.js');


var DefaultTBaseLocator = function () {

    this.SPAN = 40;
    this.SPAN_HEADER = this.createHeader(this.SPAN);

    this.AGENT_INFO = 50;
    this.AGENT_INFO_HEADER = this.createHeader(this.AGENT_INFO);

    this.AGENT_STAT = 55;
    this.AGENT_STAT_HEADER = this.createHeader(this.AGENT_STAT);

    this.SPANCHUNK =70;
    this.SPANCHUNK_HEADER = this.createHeader(this.SPANCHUNK);

    this.SPANEVENT = 80;
    this.SPANEVENT_HEADER = this.createHeader(this.SPANEVENT);

    this.APIMETADATA = 310;
    this.APIMETADATA_HEADER = this.createHeader(this.APIMETADATA);
};


DefaultTBaseLocator.prototype.createHeader = function (type) {
    var newHeader = new header.Header();
    newHeader.setType(type);
    return newHeader;
};


DefaultTBaseLocator.prototype.headerLookup = function (tbase) {
    if (tbase instanceof traceTBase.TSpan) {
        return this.SPAN_HEADER;
    }
    if (tbase instanceof pinpointTBase.TAgentInfo) {
        return this.AGENT_INFO_HEADER;
    }
    if (tbase instanceof traceTBase.TSpanEvent) {
        return this.SPANEVENT_HEADER;
    }
    if (tbase instanceof traceTBase.TSpanChunk) {
        return this.SPANCHUNK_HEADER;
    }
    if (tbase instanceof pinpointTBase.TAgentStat) {
        return this.AGENT_STAT_HEADER;
    }
    if (tbase instanceof traceTBase.TApiMetaData) {
        return this.APIMETADATA_HEADER;
    }
    throw new Error('invalid tbase!');
};


exports.DefaultTBaseLocator = DefaultTBaseLocator;
