'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isArray = exports.isObject = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.setData = setData;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @File: utils.js
 * @Project: axhr
 * @File Created: Thursday, 20th December 2018 2:24:15 pm
 * @Author: NARUTOne (wznaruto326@163.com/wznarutone326@gamil.com)
 * -----
 * @Last Modified: Thursday, 20th December 2018 2:25:00 pm
 * @Modified By: NARUTOne (wznaruto326@163.com/wznarutone326@gamil.com>)
 * -----
 * @Copyright <<projectCreationYear>> - 2018 bairong, bairong
 * @fighting: code is far away from bug with the animal protecting
 *  ┏┓      ┏┓
 *  ┏┛┻━━━┛┻┓
 *  |           |
 *  |     ━    |
 *  |  ┳┛ ┗┳ |
 *  |          |
 *  |     ┻   |
 *  |           |
 *  ┗━┓     ┏━┛
 *     |      | 神兽保佑 🚀🚀🚀
 *     |      | 代码无BUG！！！
 *     |      ┗━━━┓
 *     |            ┣┓
 *     |            ┏┛
 *     ┗┓┓ ┏━┳┓┏┛
 *      |┫┫   |┫┫
 *      ┗┻┛   ┗┻┛
 */

/**
 * utils 
 */

var isObject = exports.isObject = function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
var isArray = exports.isArray = function isArray(arr) {
  return Array.isArray(arr);
};

function setData(params) {
  var sendData = params;
  if (isObject(sendData)) {
    sendData = (0, _assign2.default)({}, sendData);
    sendData = (0, _keys2.default)(sendData).map(function (key) {
      var value = sendData[key];
      if (isArray(value) || isObject(value)) {
        value = (0, _stringify2.default)(value);
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }).join('&');
  } else {
    return new Error('options.data is object type');
  }
  return sendData;
}