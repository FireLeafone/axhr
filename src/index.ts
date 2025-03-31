import axios, { type AxiosRequestConfig } from 'axios';
import repeatXhr from './repeat';
import { isObject, setData } from './utils';

const server = axios;
let defaultSource = server.CancelToken.source();
let cancelXhrs: any[] = [];

// request interceptors
server.interceptors.request.use(
  (config: any) => {
    let cancelR: any = null;
    if (config.isCancelToken === undefined) {
      config.cancelToken = defaultSource.token; // 默认使用统一的取消标识，统一取消
    } else if (config.isCancelToken) {
      config.cancelToken = new server.CancelToken((cancel) => {
        cancelXhrs.push({ url: config.url, cancel });
        cancelR = cancel;
      });
    }

    if (config.noRepeat && config.cancelToken) {
      const requestKey = repeatXhr.generateReqKey(config);
      repeatXhr.removePendingRequest(config);
      const bol = repeatXhr.has(requestKey);
      if (!bol) {
        repeatXhr.set(requestKey, cancelR);
      }
    }

    return config;
  },
  (err) => Promise.reject(err),
);

// respone interceptors
server.interceptors.response.use(
  (response: any) => {
    const { config: responseConfig } = response;
    if (responseConfig.noRepeat) {
      repeatXhr.removePendingRequest(responseConfig); // 从pendingRequest对象中移除请求
    }
    return response;
  },
  (err: any) => {
    const { config: errConfig } = err;
    if (errConfig && errConfig.noRepeat) {
      repeatXhr.removePendingRequest(errConfig); // 从pendingRequest对象中移除请求
    }

    return Promise.reject(err);
  },
);

export type XhrConfig = AxiosRequestConfig & {
  noRepeat?: boolean;
  isCancelToken?: boolean;
};

export interface XhrOptions {
  url: string;
  type?: string;
  baseUrl?: string;
  data?: Record<string, any>;
  config?: XhrConfig;
  headers?: Record<string, any>;
  success?: (data: any, response: any) => any;
  error?: (error: any) => any;
  cancel?: (error: any) => any;
  cancelMsg?: string;
  before?: () => void;
  end?: (result: any) => void;
}

export interface XhrProps {
  request: (options?: XhrOptions) => Promise<any>;
  baseUrl?: string;
  defaultConfig?: ((options: XhrOptions) => any) | Partial<XhrConfig>;
  baseData?: Record<string, any>;
  getUrl?: (options: XhrOptions) => { baseUrl: string; url: string };
  before?: (options: XhrOptions) => void;
  success?: (options: XhrOptions, response: any) => any;
  error?: (error: any, isCancel?: boolean) => any;
  cancelXhr?: (msg: string, urls?: string[]) => any;
  cancelMsg?: string;
  end?: (result: any, isError?: boolean) => void;
}

const xhr: XhrProps = {
  request,
  defaultConfig: {},
  baseData: {},
  getUrl: () => ({ baseUrl: '', url: '' }),
  before: () => {},
  success: () => {},
  error: () => {},
};

function request(options?: XhrOptions) {
  if (!options) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'The options field is required, and the type is object, for xhr !',
      );
    }
    return Promise.reject(new Error('config is null'));
  }

  let config: AxiosRequestConfig = {
    method: (options.type || 'GET').toUpperCase(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    timeout: 3000,
  };
  let params = options.data || {};

  // 全局部分配置 xhr.defaultConfig = {}
  const defaultConf =
    typeof xhr.defaultConfig === 'function'
      ? xhr.defaultConfig(options)
      : xhr.defaultConfig;
  config = { ...config, ...defaultConf, ...options.config };
  // header
  if (options.headers) {
    config.headers = { ...config.headers, ...options.headers };
  }

  // 处理文件参数 upload file
  if (
    config.headers &&
    config.headers['Content-Type']?.indexOf('multipart/form-data') >= 0
  ) {
    if (options.data && 'append' in options.data) {
      params = options.data;
    } else {
      const formData = new FormData();
      Object.keys(options.data || {}).forEach((key) => {
        formData.append(key, options.data?.[key]);
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
    if (
      config.headers &&
      config.headers['Content-Type']?.indexOf('multipart/form-data') >= 0
    ) {
      Object.keys(xhr.baseData).forEach((key) => {
        params.append(key, xhr.baseData?.[key]);
      });
    } else if (isObject(params)) {
      // 重新处理参数
      params = { ...xhr.baseData, ...options.data };
    }
  }

  // data
  if (config.method === 'POST' || config.method === 'PUT') {
    if (
      config.headers &&
      config.headers['Content-Type']?.indexOf(
        'application/x-www-form-urlencoded',
      ) >= 0
    ) {
      config.data = setData(params) || {};
    } else if (
      config.headers &&
      config.headers['Content-Type']?.indexOf('application/json') >= 0
    ) {
      config.data = JSON.stringify(params || {});
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
    const { baseUrl, url } = xhr.getUrl(options);
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
    xhr.before(options);
  }

  const xhrsuccess = options.success || null;
  const xhrerror = options.error || null;
  const xhrcancel = options.cancel || null;
  const cancelMsg = options.cancelMsg || '';
  const configUrl = config.url;

  // console.log(config);

  return server(config)
    .then((response) => {
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
      const isSuccess = xhr.success
        ? xhr.success(response.data, response)
        : true;
      let result = null;
      if (isSuccess) {
        result = xhrsuccess
          ? xhrsuccess(response.data, response)
          : response.data;
      } else {
        const err = 'unknown error';
        // xhr.error && xhr.error(response.data);
        result = xhrerror ? xhrerror(response.data) : err;
      }

      if (xhr.end) {
        xhr.end(result);
      }

      return result;
    })
    .catch((err) => {
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

      // 触发取消请求回调
      if (axios.isCancel(err)) {
        xhrcancel && xhrcancel(err);
        // console.log(cancelMsg, err.message);
        xhr.error && xhr.error(cancelMsg || err.message, true);
      } else {
        xhr.error && xhr.error(err);
      }

      const result = xhrerror ? xhrerror(err) || err : err;
      if (xhr.end) {
        xhr.end(result, true);
      }
      return result;
    })
    .finally(() => {
      // 移除第一个匹配值
      const index = cancelXhrs.findIndex((c) => c.url === configUrl);
      cancelXhrs.splice(index, 1);
    });
}

// 主动取消请求 原理 xhr.abort(), 可以指定url取消
xhr.cancelXhr = (msg: string, urls: string[] = []) => {
  if (cancelXhrs.length) {
    if (urls && urls.length) {
      cancelXhrs = cancelXhrs.filter((c) => {
        if (urls.includes(c.url)) {
          c.cancel(`cancel request ${msg}`);
          return false;
        }
        return true;
      });
    } else {
      cancelXhrs.forEach((c) => c.cancel(`cancel request ${msg}`));
      cancelXhrs = []; // 重置
    }
  }

  // 同时取消统一标识的请求
  if (!urls || !urls.length) {
    defaultSource.cancel(`cancel request ${msg}`);
    defaultSource = server.CancelToken.source(); // 刷新 defaultSource
  }
};

export default xhr;
