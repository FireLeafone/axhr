# axhr

> XHR is configurable based on [axios](https://github.com/axios/axios) ⏲ 🚀

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

[中文文档](./README-ZH.md)

## Installing

```bash
# npm
npm install axhr axios --save
# yarn
yarn add axhr axios
```

## config

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

- **url**: `url [required]` is the server URL that will be used for the request
- **type**: `type [required]` is the request method to be used when making the request, default `GET`
- **header**: `header` are custom headers to be sent, default `'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'`
- **baseUrl**: `baseURL` will be prepended to `url` unless `url` is absolute.
- **data**: `data` is the data to be sent as the request body
- **success**: Callback after successful request and `xhr.success` intercept returns true
- **error**: Callback after failed request or `xhr.success` intercept returns false
- **cancel**: Callback after cancel request
- **cancelMsg**: cancel request message
- **config**: refer to [https://github.com/axios/axios#request-config](https://github.com/axios/axios#request-config)
  - **cancelToken**：`false`, don't cancel request; can also set unique token
  - **noRepeat**: `false`, can repeat request, custom prop, `cancelToken` isn't `false`；if `true` cancel before pending request

## API

> global definition method

### xhr.defaultConfig

> Global configuration, will merge to `config`

```js
xhr.defaultConfig = {
  timeout: 10000,
  withCredentials: true // cookie
};
```

### xhr.baseData

> Global basic params, will merge to `config.data`

```js
xhr.baseData = {
  t: Date.now() // IE catch
};
```

## xhr.baseUrl

> global baseUrl, Priority less than `xhr.getUrl`

### xhr.getUrl

> Implementing dynamic url, @params{config}

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

> Implement dynamic interception configuration when the request is successful

You can do some global logic

```js
xhr.success = res => boolean
```

### xhr.error

> Implement dynamic interception configuration when the request is failed

```js
xhr.error = (err, [isCancel]) => {}
```

### xhr.cancelXhr

> cancel request

Can specify a URL to cancel some request; no hanve urls, all requests will be cancelled

```js
xhr.cancelXhr(message, urls?: []);
```

### xhr.before

> Execute before request，

```js
xhr.before = () => {}
```

### xhr.end

> Execute end request

```js
xhr.end = (res) => {}
```

## example

```js
import xhr from 'axhr';
import {message} from 'antd';
import auth from './auth';
import {apiBaseUrl} from './config';

let apiUrl = '';

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
