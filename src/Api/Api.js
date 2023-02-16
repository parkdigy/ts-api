"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var axios_1 = require("axios");
var Api_types_1 = require("./Api.types");
var _util_1 = require("../@util");
var Api = /** @class */ (function () {
    // constructor -------------------------------------------------------------------------------------------------------
    function Api(option) {
        var _this = this;
        // Run ---------------------------------------------------------------------------------------------------------------
        this.run = function (method, path, data, option) {
            return new Promise(function (resolve, reject) {
                var _a;
                var headers = __assign({}, _this.option.headers);
                if (typeof window !== 'undefined') {
                    if ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) {
                        headers['X-Referer'] = window.location.href;
                    }
                }
                var requestConfig = {
                    method: method,
                    withCredentials: _this.option.withCredentials,
                    headers: headers,
                    silent: !!(option === null || option === void 0 ? void 0 : option.silent)
                };
                if (option === null || option === void 0 ? void 0 : option.raw) {
                    requestConfig.responseType = (option === null || option === void 0 ? void 0 : option.rawResponseType) || 'arraybuffer';
                }
                requestConfig.url = (0, _util_1.joinUrl)(_this.option.baseUrl, path.replace(/\./g, '/'));
                if (data) {
                    if (method === 'get') {
                        if ((0, _util_1.notEmpty)(data)) {
                            var finalData = {};
                            for (var key in data) {
                                if (data[key] != null) {
                                    finalData[key] = data[key];
                                }
                            }
                            requestConfig.url += "?".concat(new URLSearchParams(finalData).toString());
                        }
                    }
                    else {
                        requestConfig.data = data;
                    }
                }
                var setErrorInfo = function (err, status, response) {
                    err.config = requestConfig;
                    err.baseUrl = _this.option.baseUrl;
                    err.path = path;
                    err.requestData = data;
                    err.requestOption = option;
                    err.response = response;
                    err.status = status;
                };
                var fireError = function (err) {
                    var apiError = new Api_types_1.ApiError();
                    if (typeof err === 'object') {
                        apiError.message = err.message;
                        apiError.code = err.code;
                        setErrorInfo(apiError, err.status, err.response);
                    }
                    else if (typeof err === 'string') {
                        apiError.message = err;
                    }
                    else if (err) {
                        apiError.message = err.toString();
                    }
                    if (_this.option.onError)
                        _this.option.onError(apiError);
                    reject(apiError);
                };
                var instance = axios_1["default"].create();
                var requestInterceptor;
                if (_this.option.onRequest) {
                    requestInterceptor = instance.interceptors.request.use(_this.option.onRequest);
                }
                instance.request(requestConfig)
                    .then(function (res) {
                    var resData = res.data;
                    if (_this.option.onResponse) {
                        _this.option
                            .onResponse(res, requestConfig, _this.option.baseUrl, path, data, option)
                            .then(function (finalResData) {
                            resolve(finalResData);
                        })["catch"](function (err) {
                            setErrorInfo(err, res.status, res);
                            fireError(err);
                        });
                    }
                    else {
                        resolve(resData);
                    }
                })["catch"](fireError)["finally"](function () {
                    if (requestInterceptor) {
                        instance.interceptors.request.eject(requestInterceptor);
                    }
                });
            });
        };
        this.option = option;
    }
    Api.prototype.get = function (path, data, option) {
        return this.run('get', path, data, option);
    };
    Api.prototype.post = function (path, data, option) {
        return this.run('post', path, data, option);
    };
    Api.prototype.patch = function (path, data, option) {
        return this.run('patch', path, data, option);
    };
    Api.prototype["delete"] = function (path, data, option) {
        return this.run('delete', path, data, option);
    };
    return Api;
}());
exports["default"] = Api;
