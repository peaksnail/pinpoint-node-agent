/**
 * long 64bits Id generator
 *
 * Date: 2016-05-16 15:10
 * Author: psnail
 */

'use strict';
var IdGenarator = {

    get : function () {

        var random = Math.random();
        for (var i=0; i< random.toString().length - 1; i++) {
            random = random * 10;
        }
        return parseInt(random);
    }
};

module.exports = IdGenarator;
