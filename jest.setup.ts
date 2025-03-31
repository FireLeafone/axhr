import jasmineCore from 'jasmine-core';

// 初始化 jasmine
// @ts-ignore
global.getJasmineRequireObj = () => {
  return jasmineCore;
};

// @ts-ignore
global.jasmine = jasmineCore;

// @ts-ignore
require('jasmine-ajax');
