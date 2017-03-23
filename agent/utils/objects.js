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
