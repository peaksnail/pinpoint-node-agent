/**
 *
 * the header for thrift compact protocol
 *
 * Date: 2016-05-05 11:30
 * Author: psnail
 *
 */

'use strict';
var SIGNATURE = -17;
var HEADER_SIZE = 4;

var Header = function (signature, version, type) {

   this.signature = SIGNATURE;
   this.version = 16;
   this.type = 0;

   if (signature) {
       this.signature = signature;
   }

   if (version) {
       this.version = version;
   }

   if (type) {
       this.type = type;
   }
};

Header.prototype.getSignature = function () {
    return this.signature;
};

Header.prototype.setSignature = function (signature) {
    this.signature = signature;
};

Header.prototype.getVersion = function () {
    return this.version;
};

Header.prototype.setVersion = function (version) {
    this.version = version;
};

Header.prototype.getType = function () {
    return this.type;
};

Header.prototype.setType = function (type) {
    this.type = type;
};

exports.Header = Header;
exports.SIGNATURE = SIGNATURE;
exports.HEADER_SIZE = HEADER_SIZE;
