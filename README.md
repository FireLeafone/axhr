# axhr

> XHR is configurable based on [axios](https://github.com/axios/axios) ⏲

## Installing

Using npm:

```
$ npm install axhr
```

Using bower:

```
$ bower install axhr
```

## config

```js
xhr({
  url: '/add',
  type: 'GET',
  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
  baseUrl: 'https://some-domain.com/api/',
  data: {},
  success: res => {},
  error: res => {},
  ...others
});

```

- **url**: `url [required]` is the server URL that will be used for the request
- **type**: `type [required]` is the request method to be used when making the request, default `GET`
- **header**: `header` are custom headers to be sent, default `'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'`
- **baseUrl**: `baseURL` will be prepended to `url` unless `url` is absolute.
- **data**: `data`is the data to be sent as the request body
- **success**: Callback after successful request and `xhr.success` intercept returns true
- **error**: Callback after failed request or `xhr.success` intercept returns false
- **others**: refer to [https://github.com/axios/axios#request-config](https://github.com/axios/axios#request-config)

## API

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
xhr.error = err => {}
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

xhr.success = (response) => {
  const res = response;
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