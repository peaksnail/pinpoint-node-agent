/**
 *
 * serialize the data
 *
 * Date: 2016-05-05 17:30
 * Author: psnail
 *
 */

'use strict';
var DefaultTBaseLocator = require('./default_tbase_locator.js').DefaultTBaseLocator;
var thrift = require('thrift');
var TCompactProtocol = thrift.TCompactProtocol;  //use thrift compact protocol
var TFramedTransport = thrift.TFramedTransport;



var Serialize = function () {

    var pri = { 
    
        locator : null,
        header : null,
        transport : null,
        protocol : null
    
    };

    var pub = {

        serialize : function (tbase) {

            pri.locator = new DefaultTBaseLocator(); 
            pri.header = pri.locator.headerLookup(tbase);
            pri.transport = new TFramedTransport();
            pri.protocol = new TCompactProtocol(pri.transport);
            tbase.write(pri.protocol);

            //get the header and tbase byteArray and concat to Buffer
            //outBuffers is BufferArray
            var headerBuffer = pub.headerSerialize(pri.header);
            return Buffer.concat([headerBuffer, Buffer.concat(pri.transport.outBuffers)]);
        },

        /*
         * header protocol setting for pinpoint
         *
         */
        headerSerialize : function (header) {
            
            var buffer = new Buffer(4);
            buffer.writeInt8(header.getSignature(), 0);
            buffer.writeInt8(header.getVersion(), 1);
            //type is short,16 bits
            buffer.writeUInt16BE(header.getType(), 2);
            return buffer; 
        },

        getLocator : function () {
            return pri.locator;
        },

        getHeader : function () {
            return pri.header;
        }

    };

    return pub;

};


module.exports = Serialize;
