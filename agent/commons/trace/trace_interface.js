/**
 * trace interface for define
 *
 * Date: 2016-05-29 20:30
 * Author: psnail
 */

'use strict';
var TraceInterface = function TraceInterface() {
};

TraceInterface.prototype.before = function () {
    //trace before interface
};

TraceInterface.prototype.after= function () {
    //trace after interface
};

module.exports = TraceInterface;
