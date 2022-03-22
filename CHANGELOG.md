# Changelog

> pm log 🚀

## 0.4.5

`2022-03-22`

- 🐛 修复`application/json`参数数据处理

## 0.4.4

`2022-03-10`

- 取消请求标识支持区分url
- `xhr.cancelXhr`支持传入urls取消指定urls, 不传urls 则取消所有请求

## 0.4.1

`2021-07-28`

- `cancel: (err) => void` 取消请求回调
- `cancelMsg` 取消请求提示信息
- `xhr.error` 支持第二个参数，判断是否是取消请求的错误

## 0.4.0

`2021-04-29`

- 🚀 升级依赖`axios`, `lodash`
- 🚀 支持重复请求取消`noRepeat`
- 修复 `xhe.end` 调用顺序问题
- 完善单元测试
- 新增中文文档

## 0.3.1

`2020-04-27`

- `package.json`新增 `peerDependencies`

## 0.3.0

`2020-04-22`

- `axios`, `lodash` 打包放入`externals`

## 0.2.2

`2020-04-14`

- `xhr.cancelXhr` 支持 msg

## 0.2.1

`2020-02-27`

- 新增 `xhr.before`, `xhr.end`

## 0.1.7

`2019-09-04`

- 采用webpack进行库打包、发布

## 0.1.6

`2019-07-26`

- jest mock

## 0.1.5

`2019-04-25`

- 🐛 修复config配置headers覆盖bug

## 0.1.4

`2019-04-24`

- ➕ 添加 `xhr.cancelXhr` 批量取消请求

## 0.1.2

`2019-01-10`

- 🐛 修复 `FormData` 数据bug

## 0.1.0

`2018-12-24` 🍎

- 开启项目， start
