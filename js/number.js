// ToDo: 128bit floating point

(function() {
    'use strict';

    var number = number || {};

    var EXPONENT_BIT_16 = 5;
    var FRACTION_BIT_16 = 10;

    var EXPONENT_BIT_32 = 8;
    var FRACTION_BIT_32 = 23;

    var EXPONENT_BIT_64 = 11;
    var FRACTION_BIT_64 = 52;

    var EXPONENT_BIT_128 = 15;
    var FRACTION_BIT_128 = 112;

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

    number.toHalf = function toHalf(x) {
        return toBinary(x, 16);
    };

    number.toSingle = function toSingle(x) {
        return toBinary(x, 32);
    };

    number.toDouble = function toDouble(x) {
        return toBinary(x, 64);
    };

    number.toQuadruple = function toQuadruple(x) {
        return toBinary(x, 128);
    };

    // 64 bit floating point by IEEE754
    // cf: https://en.wikipedia.org/wiki/IEEE_floating_point
    function toBinary(x, bit) {
        var exponentBit;
        var fractionBit;

        var s; // sign of x
        var sign; // 0 for plus or 1 for minus
        var q; // exponent not bias
        var exponent; // bias 1023
        var cStr;
        // var c; // 1.fraction
        // var fraction;
        var emax;

        var bitInfo = {
            16: {
                exponentBit: EXPONENT_BIT_16,
                fractionBit: FRACTION_BIT_16
            },
            32: {
                exponentBit: EXPONENT_BIT_32,
                fractionBit: FRACTION_BIT_32
            },
            64: {
                exponentBit: EXPONENT_BIT_64,
                fractionBit: FRACTION_BIT_64
            },
            128: {
                exponentBit: EXPONENT_BIT_128,
                fractionBit: FRACTION_BIT_128
            }
        }[bit];

        exponentBit = bitInfo.exponentBit;
        fractionBit = bitInfo.fractionBit;

        emax = Math.pow(2, exponentBit - 1) - 1;

        var str = (x || 0).toString(2);

        if(false) {
        } else if(x === 0) {
            q = 0;
            cStr = '0';
        } else if(!x) {
            return;
        } else if(number.isInteger(x)) {
            q = (str.match(/^-?1([01]*)$/) || {1: ''})[1].length;

            cStr = (str.match(/^-?1([01]*)$/) || {1: '0'})[1] || '0';
        } else {
            if(false) {
            } else if(Math.abs(x) > 1) {
                q = (str.match(/^-?1([01]*)\.[01]*$/) || {1: ''})[1].length;

                cStr = (str.replace(/\./, '').match(/^-?1([01]*)$/) || {1: '0'})[1] || '0';
            } else if(Math.abs(x) < 1) {
                q = - ((str.match(/^-?0\.(0*)1[01]*$/) || {1: ' '})[1].length + 1);

                cStr = (str.match(/^-?0\.0*1([01]*)$/) || {1: '0'})[1] || '0';
            } else {
                q = 0;

                cStr = '0';
            }
        }

        exponent = q + emax;

        s = Math.sign(x);
        sign = (s === 0)? 0 : (s > 0)? 0 : 1;

        return sign.toString(2) + padLeft(exponent.toString(2), exponentBit) + padRight(cStr, fractionBit);
    }

    function padLeft(str, n) {
        var zeros = (new Array(n + 1)).join('0');
        return (zeros + str).slice(-n);
    }

    function padRight(str, n) {
        var zeros = (new Array(n + 1)).join('0');
        return (str + zeros).slice(0, n);
    }

    number.parseHalf = function parseHalf(str) {
        return parseBinary(str, 16);
    };

    number.parseSingle = function parseSingle(str) {
        return parseBinary(str, 32);
    };

    number.parseDouble = function parseDouble(str) {
        return parseBinary(str, 64);
    };

    number.parseQuadruple = function parseQuadruple(str) {
        return parseBinary(str, 128);
    };

    function parseBinary(str, bit) {
        var signStr;
        var exponentStr;
        var fractionStr;

        var fraction;

        var s; // sign
        var q; // exponent not bias
        var c; // 1.fraction

        var exponentBit;
        var fractionBit;

        var emax;

        var bitInfo = {
            16: {
                exponentBit: EXPONENT_BIT_16,
                fractionBit: FRACTION_BIT_16
            },
            32: {
                exponentBit: EXPONENT_BIT_32,
                fractionBit: FRACTION_BIT_32
            },
            64: {
                exponentBit: EXPONENT_BIT_64,
                fractionBit: FRACTION_BIT_64
            },
            128: {
                exponentBit: EXPONENT_BIT_128,
                fractionBit: FRACTION_BIT_128
            }
        }[bit];

        exponentBit = bitInfo.exponentBit;
        fractionBit = bitInfo.fractionBit;

        emax = Math.pow(2, exponentBit - 1) - 1;

        signStr = str.slice(0, 1);
        exponentStr = str.slice(1, 1 + exponentBit);
        fractionStr = str.slice(1 + exponentBit, 1 + exponentBit + fractionBit);

        s = Math.pow(-1, parseInt(signStr, 2));
        q = parseInt(exponentStr, 2) - emax;
        fraction = parseInt(fractionStr, 2);
        c = 1 + fraction / Math.pow(2, fractionBit);

        return s * c * Math.pow(2, q);
    }

    window.number = number;
}());