"use strict";
exports.__esModule = true;
exports.joinUrl = void 0;
var url_join_1 = require("url-join");
function joinUrl() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    var url = url_join_1["default"].apply(void 0, paths);
    while (url.indexOf('//') > -1) {
        url = url.replace(/\/\//g, '/');
    }
    return url;
}
exports.joinUrl = joinUrl;
