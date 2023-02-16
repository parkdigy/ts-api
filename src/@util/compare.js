"use strict";
exports.__esModule = true;
exports.notEmpty = exports.empty = void 0;
var empty = function (v) {
    var result = false;
    if (v == null) {
        result = true;
    }
    else if (typeof v === 'string') {
        result = v === '';
    }
    else if (typeof v === 'object') {
        if (Array.isArray(v)) {
            result = v.length === 0;
        }
        else if (!(v instanceof Date)) {
            result = Object.entries(v).length === 0;
        }
    }
    return result;
};
exports.empty = empty;
var notEmpty = function (v) {
    return !empty(v);
};
exports.notEmpty = notEmpty;
