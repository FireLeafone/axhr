import xhr from '../src/index';

let apiUrl = '';
const apiBaseUrl = 'https://easy-mock.com/mock/5d3d72c93754634e08f8aecd/axhr/';

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