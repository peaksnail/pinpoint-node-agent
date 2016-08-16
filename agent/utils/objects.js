/**
 * object for extends and implements
 *
 * Date: 2016-05-12 9:30
 * Author: psnail
 *
 */

'use strict';
var Objects = {

    implements : function (conflict, child, parent) {
        var  i = parent.prototype;
        var c = child.prototype;
        for (var j in i) {
            if (c[j] === undefined || conflict === true) {
                c[j] = i[j];
            } else {
                throw new Error('prototype: ' + j + ' is conflict');
            }
        }
    },

    extends : function (conflict, child, parent) {
        var  p = parent.prototype;
        var c = child.prototype;
        for (var j in p) {
            if (c[j] === undefined || conflict === true) {
                c[j] = p[j];
            } else {
                throw new Error('prototype: ' + j + ' is conflict');
            }
        }
        c.uber = p;
    
    }

};

module.exports = Objects;
