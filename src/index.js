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

import axios from 'axios';
import {isObject, setData} from './utils';

const server = axios;

// request interceptors
server.interceptors.request.use(function (config) {
  return config;
}, function (err) {
  return Promise.reject(err);
});

// respone interceptors
server.interceptors.response.use(function (response) {
  return response;
}, function (err) {
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
 *    success: res => {},
 *    error: error => {}
 * }
 * ```
 * @return {object}  return an object containing either "data" or "err"
 */

export default function xhr (options) {
  if (!options) return new Error('The options field is required, and the type is object, for XHR !');

  let config = {
    method: (options.type || 'GET').toUpperCase(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    timeout: 3000
  };
  let params = options.data || {};

  // 全局部分配置 xhr.defaultConfig = {}
  config = Object.assign({}, options.config || {}, config, xhr.defaultConfig || {});

  // header
  if (options.headers) {
    config.headers = Object.assign({}, config.headers, options.headers);
  }

  if (config.headers['Content-Type'].indexOf('application/x-www-form-urlencoded') >= 0) {
    params = setData(params) || {};
  } else if (config.headers['Content-Type'].indexOf('multipart/form-data') >= 0) { // upload file
    const formData = new FormData();
    Object.keys(options.data).map(key => {
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

  const xhrsuccess = options.success || null;
  const xhrerror = options.error || null;

  return server(config).then(response => {
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
    const isSuccess = xhr.success ? xhr.success(response.data) : true;

    if (isSuccess) {
      return xhrsuccess ? xhrsuccess(response.data) : response.data;
    } else {
      const err = 'unknown error';
      // xhr.error && xhr.error(response.data);
      return xhrerror ? xhrerror(response.data) : err;
    }
  }).catch(err => {
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
