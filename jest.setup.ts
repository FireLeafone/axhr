import JasmineCore from 'jasmine-core';
import 'jasmine-ajax';
// 每次jest都会执行
// @ts-ignore
global.getJasmineRequireObj = function () {
  return JasmineCore;
};
