import axios from'axios';/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};//--------------------------------------------------------------------------------------------------------------------
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(message, code) {
        var _this = _super.call(this, message) || this;
        _this.isAxiosError = false;
        _this.code = code;
        return _this;
    }
    return ApiError;
}(Error));var empty = function (v) {
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
var notEmpty = function (v) {
    return !empty(v);
};function normalize (strArray) {
  var resultArray = [];
  if (strArray.length === 0) { return ''; }

  if (typeof strArray[0] !== 'string') {
    throw new TypeError('Url must be a string. Received ' + strArray[0]);
  }

  // If the first part is a plain protocol, we combine it with the next part.
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    var first = strArray.shift();
    strArray[0] = first + strArray[0];
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
  }

  for (var i = 0; i < strArray.length; i++) {
    var component = strArray[i];

    if (typeof component !== 'string') {
      throw new TypeError('Url must be a string. Received ' + component);
    }

    if (component === '') { continue; }

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[\/]+/, '');
    }
    if (i < strArray.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/[\/]+$/, '');
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[\/]+$/, '/');
    }

    resultArray.push(component);

  }

  var str = resultArray.join('/');
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, '$1');

  // replace ? in parameters with &
  var parts = str.split('?');
  str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');

  return str;
}

function urlJoin() {
  var input;

  if (typeof arguments[0] === 'object') {
    input = arguments[0];
  } else {
    input = [].slice.call(arguments);
  }

  return normalize(input);
}function joinUrl() {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    var url = urlJoin.apply(void 0, paths);
    while (url.indexOf('//') > -1) {
        url = url.replace(/\/\//g, '/');
    }
    return url;
}var Api = /** @class */ (function () {
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
                    silent: !!(option === null || option === void 0 ? void 0 : option.silent),
                };
                if (option === null || option === void 0 ? void 0 : option.raw) {
                    requestConfig.responseType = (option === null || option === void 0 ? void 0 : option.rawResponseType) || 'arraybuffer';
                }
                requestConfig.url = joinUrl(_this.option.baseUrl, path.replace(/\./g, '/'));
                if (data) {
                    if (method === 'get') {
                        if (notEmpty(data)) {
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
                    var apiError = new ApiError();
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
                var instance = axios.create();
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
                        })
                            .catch(function (err) {
                            setErrorInfo(err, res.status, res);
                            fireError(err);
                        });
                    }
                    else {
                        resolve(resData);
                    }
                })
                    .catch(fireError)
                    .finally(function () {
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
    Api.prototype.delete = function (path, data, option) {
        return this.run('delete', path, data, option);
    };
    return Api;
}());export{Api,ApiError};//# sourceMappingURL=index.esm.js.map
