
const JasmineCore = require('jasmine-core');
// 每次jest都会执行
// @ts-ignore
global.getJasmineRequireObj = function() {
  return JasmineCore;
};
require('jasmine-ajax');
