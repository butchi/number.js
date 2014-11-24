// ToDo: 128bit floating point

(function() {
    'use strict';

    var number = number || {};

    var FRACTION_BIT = 52;
    var EXPONENT_BIT = 11;

    number.zero = 0;

    number.mzero = -0;

    number.isInt32 = function isInt(x) {
        return x === ~~x;
    };

    number.isInteger = function isInteger(x) {
        return (x % 1) === 0;
    };

    number.isCountable = function isCountable(x) {
        return !(x === x + 1);
    };

    // 64 bit floating point by IEEE754
    // cf: https://en.wikipedia.org/wiki/IEEE_floating_point
    number.toDouble = function toDouble(x) {
        var s = 0; // sign of x
        var sign = 0; // 0 for plus or 1 for minus
        var q = 0; // not bias
        var exponent = 0; // bias 1023
        var cStr = '0';
        var c = 0; // 1.fraction
        // var fraction = 0;
        var emax = Math.pow(2, EXPONENT_BIT - 1) - 1;

        var str = (x || 0).toString(2);

        if(false) {
        } else if(x === 0) {
            q = 0;
            cStr = '0';
        } else if(!x) {
            return;
        } else if(number.isInteger(x)) {
            q = (str.match(/^-?1([01]*)$/) || {1: ''})[1].length;
            exponent = q + emax;

            cStr = (str.match(/^-?1([01]*)$/) || {1: ''})[1] || '0';
        } else {
            if(false) {
            } else if(Math.abs(x) > 1) {
                q = (str.match(/^-?1([01]*)\.[01]*$/) || {1: ''})[1].length;

                cStr = (str.replace(/\./, '').match(/^-?1([01]*)$/) || {1: ''})[1] || '0';
            } else if(Math.abs(x) < 1) {
                q = - ((str.match(/^-?[01]*\.[01]*1([01]*)$/) || {1: ' '})[1].length - 1);

                cStr = (str.match(/^-?[01]*\.[01]*1([01]*)$/) || {1: ''})[1] || '0';
            } else {
                q = 0;

                cStr = '0';
            }
            exponent = q + emax;
        }

        s = Math.sign(x);
        sign = (s === 0)? 0 : (s > 0)? 0 : 1;

        return sign.toString(2) + padLeft(exponent.toString(2), EXPONENT_BIT) + padRight(cStr, FRACTION_BIT);
    };

    function padLeft(str, n) {
        var zeros = (new Array(n + 1)).join('0');
        return (zeros + str).slice(-n);
    }

    function padRight(str, n) {
        var zeros = (new Array(n + 1)).join('0');
        return (str + zeros).slice(0, n);
    }

    window.number = number;
}());