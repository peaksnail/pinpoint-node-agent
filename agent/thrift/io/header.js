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
