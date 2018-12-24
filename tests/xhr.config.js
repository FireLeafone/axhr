import xhr from '../src/index';

let apiUrl = '';
const apiBaseUrl = '/api/';

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
  timeout: 10000
};

xhr.success = (response) => {
  const res = response;
  let isSuccess = true;

  if (typeof res !== 'object') {
    new Error(apiUrl + ': response data should be JSON');
    isSuccess = false;
  }
  switch (res.code + '') {
    case '000000':
      isSuccess = true;
      break;
    case '200':
      isSuccess = true;
      break;
    default:
      new Error(res.message || 'unknown error');
      isSuccess = false;
  }

  return isSuccess;
};

xhr.error = () => {
  new Error('The server strayed！');
};