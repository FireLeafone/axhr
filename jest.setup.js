// 每次jest都会执行
const JasmineCore = require('jasmine-core');
// @ts-ignore
global.getJasmineRequireObj = function() {
  return JasmineCore;
};
require('jasmine-ajax');
