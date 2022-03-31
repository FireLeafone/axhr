# axhr

> XHR 配置化请求库 基于 [axios](https://github.com/axios/axios) ⏲ 🚀

---

[![AXHR][axhr-img]][axhr-url]
[![AXHR version][npm-img]][npm-url]
[![npm download][download-img]][download-url]
[![build status][travis-img]][travis-url]

[axhr-url]: https://github.com/FireLeafone/axhr
[axhr-img]: https://img.shields.io/badge/axhr-coding-green.svg
[npm-url]: https://www.npmjs.com/package/axhr
[npm-img]: https://img.shields.io/npm/v/axhr.svg
[download-url]: https://www.npmjs.com/package/axhr
[download-img]: https://img.shields.io/npm/dm/axhr.svg
[travis-url]: https://travis-ci.org/FireLeafone/axhr
[travis-img]: https://travis-ci.org/FireLeafone/axhr.svg?branch=master

## Installing

```bash
# npm
npm install axhr axios --save
# yarn
yarn add axhr axios
```

## use

```js
xhr({
  url: '/add',
  type: 'GET',
  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
  baseUrl: 'https://some-domain.com/api/',
  data: {},
  config: {
    ...others
  },
  cancelMsg: '',
  success: (res, response) => {},
  error: res => {},
  cancel: err => {},  
});

```

- **url**: `url [required]` 请求接口服务地址
- **type**: `type [required]` 请求方式, 默认 `GET`
- **header**: `header` 自定义请求头, 默认 `'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'`
- **baseUrl**: `baseURL`基础地址， 除非`url`是绝对地址，否则会加在`url`前面
- **data**: `data` 请求体参数，会根据配置自动转`params`或`data`
- **success**: 请求成功响应， 使用`xhr.success` 拦截需要返回 `true`
- **error**: 请求失败响应 或 `xhr.success` 拦截返回 `false`
- **cancel**: 取消请求响应
- **cancelMsg**: 取消请求提示信息
- **config**: 请求配置项，详情见[https://github.com/axios/axios#request-config](https://github.com/axios/axios#request-config)
  - **cancelToken**：`false`, 默认当前请求不参与取消请求; 也可以设置`true`，独立token
  - **noRepeat**: `false`, 默认不判断重复请求, `cancelToken` 必须是 `true` 将会取消还未响应结束的上一个重复请求

## API

> 搭配一些全局定义方法进行全局配置，对所有请求管用

### xhr.defaultConfig

> 全局默认配置, 将会合并进 `config`

```js
xhr.defaultConfig = {
  timeout: 10000,
  withCredentials: true // cookie
};
```

### xhr.baseData

> 全局基础参数, 将会合并进 `config.data`

```js
xhr.baseData = {
  t: Date.now() // IE catch
};
```

## xhr.baseUrl

> 全局定义`baseUrl` 优先级低于 `xhr.getUrl`

### xhr.getUrl

> 全局动态设置获取`url`, `baseUrl`

```js
const apiBaseUrl = '/oapi';

xhr.getUrl = option => {
  if (option.baseUrl) {
    return {
      baseUrl: option.baseUrl,
      url: option.url
    };
  }
  return {
    baseUrl: apiBaseUrl,
    url: option.url
  };
};
```

### xhr.success

> 当请求成功时实现动态拦截配置, 也可以在这块做一些接口数据返回初步逻辑拦截

```js
xhr.success = (res, resp) => {
  let isSuccess = true;

  if (typeof res === 'string') {
    res = JSON.parse(res);
  }

  if (typeof res !== 'object') {
    // console.error(apiUrl + ': response data should be JSON');
    isSuccess = false;
  }
  switch (res.code + '') {
    case '200':
      isSuccess = true;
      break;
    default:
      // console.error(res.message || 'unknown error');
      isSuccess = false;
  }

  return isSuccess;
}
```

### xhr.error

> 当请求失败时实现动态拦截配置,

```js
xhr.error = (err, [isCancel]) => {}
```

### xhr.cancelXhr

> 手动调用取消请求，并传递取消信息

可以指定urls取消；不传urls则取消所有请求

```js
xhr.cancelXhr(message, urls?: []);
```

### xhr.before

> 请求前执行

```js
xhr.before = () => {}
```

### xhr.end

> 请求后执行

```js
xhr.end = (res) => {}
```

## 全局配置

> 简单示例

```js
import xhr from 'axhr';
import {message} from 'antd';
import auth from './auth';

let apiUrl = '';
const apiBaseUrl = '/';

xhr.getUrl = option => {
  if (option.baseUrl) {
    apiUrl = option.baseUrl + option.url;
    return {
      baseUrl: option.baseUrl,
      url: option.url
    };
  }
  apiUrl = apiBaseUrl + option.url;
  return {
    baseUrl: apiBaseUrl,
    url: option.url
  };
};

xhr.baseData = {
  t: Date.now()
};

xhr.defaultConfig = {
  timeout: 10000,
  withCredentials: true
};

xhr.success = (res, response) => {
  let isSuccess = true;

  if (typeof res !== 'object') {
    message.error(apiUrl + ': response data should be JSON');
    isSuccess = false;
  }
  switch (res.code + '') {
    case '000000':
      isSuccess = true;
      break;
    case '100006':
      auth.toOutLogin();
      isSuccess = false;
      break;
    case '100013':
      auth.toOutLogin();
      isSuccess = false;
      break;
    default:
      message.error(res.message || 'unknown error');
      isSuccess = false;
  }

  return isSuccess;
};

xhr.error = (err) => {
  message.error('The server strayed！');
};
```
