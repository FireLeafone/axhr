/*
 * @File: index.js
 * @Project: axhr
 * @File Created: Thursday, 20th December 2018 2:26:34 pm
 * @Author: NARUTOne (wznaruto326@163.com/wznarutone326@gamil.com)
 * -----
 * @Last Modified: Thursday, 20th December 2018 2:27:00 pm
 * @Modified By: NARUTOne (wznaruto326@163.com/wznarutone326@gamil.com>)
 * -----
 * @Copyright <<projectCreationYear>> - 2018
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

import axios from 'axios';
import merge from 'lodash/merge';
import repeatXhr from './repeat';
import {isObject, setData} from './utils';

const server = axios;
server.defaultSource = server.CancelToken.source();
let cancelXhr = null;

// request interceptors
server.interceptors.request.use(function (config) {
  if (config.cancelToken === undefined) {
    config.cancelToken = server.defaultSource.token;
  } else if (config.cancelToken) {
    config.cancelToken = new server.CancelToken((cancel) => {
      cancelXhr = cancel;
    });
  }

  if (config.noRepeat && config.cancelToken) {
    const requestKey = repeatXhr.generateReqKey(config);
    repeatXhr.removePendingRequest(config);
    const bol = repeatXhr.has(requestKey);
    if (!bol) {
      repeatXhr.set(requestKey, cancelXhr);
    }
  }

  return config;
}, function (err) {
  return Promise.reject(err);
});

// respone interceptors
server.interceptors.response.use(function (response) {
  const {config} = response;
  if (config.noRepeat) {
    repeatXhr.removePendingRequest(config); // 从pendingRequest对象中移除请求
  }
  return response;
}, function (err) {
  const {config} = err;
  if (config && config.noRepeat) {
    repeatXhr.removePendingRequest(config); // 从pendingRequest对象中移除请求
  }

  return Promise.reject(err);
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
 *    config: {}, axios request-config
 *    noRepeat: false,
 *    success: res => {},
 *    error: error => {}
 *
 * }
 * ```
 * @return {object}  return an object containing either "data" or "err"
 */

// 主动取消请求 原理 xhr.abort()
xhr.cancelXhr = (msg) => {
  if (cancelXhr) {
    cancelXhr('cancel request ' + msg);
  } else {
    server.defaultSource.cancel('cancel request ' + msg);
    server.defaultSource = server.CancelToken.source(); // 刷新 defaultSource
  }
};

export default function xhr (options) {
  if (!options) {
    if (process.env.NODE_ENV === 'development') {
      console.error('The options field is required, and the type is object, for xhr !');
    }
    return Promise.reject('config is null');
  }

  let config = {
    method: (options.type || 'GET').toUpperCase(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    timeout: 3000
  };
  let params = options.data || {};

  // 全局部分配置 xhr.defaultConfig = {}
  config = merge({}, config, xhr.defaultConfig || {}, options.config || {});
  // header
  if (options.headers) {
    config.headers = merge({}, config.headers, options.headers);
  }

  if (config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') >= 0) {
    params = setData(params) || {};
  } else if (config.headers['Content-Type'].indexOf('multipart/form-data') >= 0) { // upload file
    if('append' in options.data) {
      params = options.data;
    } else {
      const formData = new FormData();
      Object.keys(options.data).map(key => {
        formData.append(key, options.data[key]);
      });
      params = formData;
    }
  }

  /**
   *  @public
     * @name xhr.baseData
     * @type {Object}
     * @description 全局基础参数,将为每个调用xhr的接口合并参数data；适合放置项目接口需要的sessionId等。
     * 配置 xhr_config.js
  */
  if (xhr.baseData && isObject(xhr.baseData)) {
    if (config.headers['Content-Type'].indexOf('multipart/form-data') >= 0) {
      Object.keys(xhr.baseData).map(key => {
        params.append(key, xhr.baseData[key]);
      });
    } else {
      params = Object.assign({}, xhr.baseData, options.data);
    }
  }

  // data
  if (config.method === 'POST' || config.method === 'PUT') {
    if (config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') >= 0) {
      config.data = setData(params) || {};
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
    const {baseUrl, url} = xhr.getUrl(options);
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

  /**
   * 请求前before
   */
  if (xhr.before) {
    xhr.before();
  }

  const xhrsuccess = options.success || null;
  const xhrerror = options.error || null;

  // console.log(config);

  return server(config).then(response => {
    /**
   * @public
   * @name xhr.success
   * @param {object} response.data 当前response的data
   * @param {object} response 当前response
   * @description 实现动态 拦截配置
   * ```js
   * xhr.success = res, [response] => boolean
   * ```
   * @return {boolean}
   */
    const isSuccess = xhr.success ? xhr.success(response.data, response) : true;
    let result = null;
    if (isSuccess) {
      result =  xhrsuccess ? xhrsuccess(response.data, response) : response.data;
    } else {
      const err = 'unknown error';
      // xhr.error && xhr.error(response.data);
      result = xhrerror ? xhrerror(response.data) : err;
    }

    if (xhr.end) {
      xhr.end();
    }

    return result;
  }).catch(err => {
    /**
   * @public
   * @name xhr.error
   * @param {string} error error
   * @description 实现动态 拦截配置
   * ```js
   * xhr.error = res => boolean
   * ```
   * @return
   */

    xhr.error && xhr.error(err);
    const result = xhrerror ? xhrerror(err) : err;
    if (xhr.end) {
      xhr.end();
    }
    return result;
  });
}
