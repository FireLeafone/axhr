import xhr from '../src/index';

let apiUrl = '';
const apiBaseUrl = '/api';

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
  headers: {
    ticket: 'xxx'
  }
};

xhr.success = (res) => {
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
};

// xhr.error = () => {
//   console.error('The server strayed！');
// };
