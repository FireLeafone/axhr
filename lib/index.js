'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = xhr;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @File: index.js
 * @Project: axhr
 * @File Created: Thursday, 20th December 2018 2:26:34 pm
 * @Author: NARUTOne (wznaruto326@163.com/wznarutone326@gamil.com)
 * -----
 * @Last Modified: Thursday, 20th December 2018 2:27:00 pm
 * @Modified By: NARUTOne (wznaruto326@163.com/wznarutone326@gamil.com>)
 * -----
 * @Copyright <<projectCreationYear>> - 2018 bairong, bairong
 * @fighting: code is far away from bug with the animal protecting
 *  ┏┓      ┏┓
 *  ┏┛┻━━━┛┻┓
 *  |           |
 *  |     ━    |
 *  |  ┳┛ ┗┳ |
 *  |          |
 *  |     ┻   |
 *  |           |
 *  ┗━┓     ┏━┛
 *     |      | 神兽保佑 🚀🚀🚀
 *     |      | 代码无BUG！！！
 *     |      ┗━━━┓
 *     |            ┣┓
 *     |            ┏┛
 *     ┗┓┓ ┏━┳┓┏┛
 *      |┫┫   |┫┫
 *      ┗┻┛   ┗┻┛
 */

var server = _axios2.default;

// request interceptors
server.interceptors.request.use(function (config) {
  return config;
}, function (err) {
  return _promise2.default.reject(err);
});

// respone interceptors
server.interceptors.response.use(function (response) {
  return response;
}, function (err) {
  return _promise2.default.reject(err);
});

/**
 * Requests a URL, returning a promise.
 * @public
 * @name xhr
 * @param  {object} [options] The options we want to pass to "fetch"
 * ```js
 *  options = {
 *    url: 'api',  //{string} url , The URL we want to request
 *    type: 'GET',
 *    baseUrl: 'http://', xhr实例的baseUrl
 *    data: {},
 *    success: res => {},
 *    error: error => {}
 * }
 * ```
 * @return {object}  return an object containing either "data" or "err"
 */

function xhr(options) {
  if (!options) return new Error('The options field is required, and the type is object, for XHR !');

  var config = {
    method: (options.type || 'GET').toUpperCase(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    timeout: 3000
  };
  var params = options.data || {};

  // 全局部分配置 xhr.defaultConfig = {}
  config = (0, _assign2.default)({}, config, xhr.defaultConfig || {}, options.config || {});

  // header
  if (options.headers) {
    config.headers = (0, _assign2.default)({}, config.headers, options.headers);
  }

  if (config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') >= 0) {
    params = (0, _utils.setData)(params) || {};
  } else if (config.headers['Content-Type'].indexOf('multipart/form-data') >= 0) {
    // upload file
    var formData = new FormData();
    (0, _keys2.default)(options.data).map(function (key) {
      formData.append(key, options.data[key]);
    });
    params = formData;
  }

  /**
   *  @public
     * @name xhr.baseData
     * @type {Object}
     * @description 全局基础参数,将为每个调用xhr的接口合并参数data；适合放置项目接口需要的sessionId等。
     * 配置 xhr_config.js
  */
  if (xhr.baseData && (0, _utils.isObject)(xhr.baseData)) {
    if (config.headers['Content-Type'].indexOf('multipart/form-data') >= 0) {
      (0, _keys2.default)(xhr.baseData).map(function (key) {
        params.append(key, xhr.baseData[key]);
      });
    } else {
      params = (0, _assign2.default)({}, xhr.baseData, options.data);
    }
  }

  // data
  if (config.method === 'POST' || config.method === 'PUT') {
    if (config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') >= 0) {
      config.data = (0, _utils.setData)(params) || {};
    } else {
      config.data = params || {};
    }
  } else if (config.method === 'GET') {
    config.params = params || {};
  } else {
    config.data = params || {};
  }

  /**
   * @public
   * @name xhr.getUrl
   * @param {object} options 当前请求配置
   * @description 实现动态 url
   * ```js
   * xhr.getUrl = option => [apiBaseUrl] + option.url
   * ```
   * @return {object} 返回实际请求 {baseUrl, url}
   */
  if (xhr.getUrl) {
    var _xhr$getUrl = xhr.getUrl(options),
        baseUrl = _xhr$getUrl.baseUrl,
        url = _xhr$getUrl.url;

    config.baseURL = baseUrl;
    config.url = url;
  } else {
    /**
     * @public
     * @name xhr.baseUrl
     * @type {string}
     * @description 全局基础 URL，常用的场景是接口是另外的服务，方便统一设置路径, 默认使用脚手架中 src/utils/config 中的apiBaseUrl,
     * 配置 xhr_config.js
     */

    config.baseURL = options.baseUrl || xhr.baseUrl || '';
    config.url = options.url;
  }

  var xhrsuccess = options.success || null;
  var xhrerror = options.error || null;

  return server(config).then(function (response) {
    /**
    * @public
    * @name xhr.success
    * @param {object} response 当前response
    * @description 实现动态 拦截配置
    * ```js
    * xhr.success = res => boolean
    * ```
    * @return {boolean}
    */
    var isSuccess = xhr.success ? xhr.success(response.data) : true;

    if (isSuccess) {
      return xhrsuccess ? xhrsuccess(response.data) : response.data;
    } else {
      var err = 'unknown error';
      // xhr.error && xhr.error(response.data);
      return xhrerror ? xhrerror(response.data) : err;
    }
  }).catch(function (err) {
    /**
    * @public
    * @name xhr.error
    * @param {string} error error
    * @description 实现动态 拦截配置
    * ```js
    * xhr.error = res => boolean
    * ```
    * @return {boolean}
    */

    xhr.error && xhr.error(err);
    return xhrerror ? xhrerror(err) : err;
  });
}