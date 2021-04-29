/*
 * @File: repeat.js
 * @Project: axhr
 * @Date: Tuesday, 27th April 2021 10:48:30 am
 * @Author: NARUTOne (wznaruto326@163.com/wznarutone326@gamil.com)
 * -----
 * @Last Modified: Tuesday, 27th April 2021 10:48:49 am
 * @Modified By: NARUTOne
 * -----
 * @Copyright fireLeaf © 2021 axhr, ***
 * @fighting: 思则行之，迟则忘之，久而久之，恒则竟之
 */

/**
 * 重复请求处理
 */
const repeatXhr = {
  pendingRequest: new Map(),
  has(key) {
    return this.pendingRequest && this.pendingRequest.has(key);
  },
  get(key) {
    if (this.pendingRequest) {
      return this.pendingRequest.get(key);
    }
  },
  set(key, val) {
    if (this.pendingRequest) {
      this.pendingRequest.set(key, val);
    }
  },
  delete(key) {
    if (this.pendingRequest) {
      this.pendingRequest.delete(key);
    }
  },
  generateReqKey(config) {
    try {
      const { method, url, params, data } = config;
      return [method, url, JSON.stringify(params), JSON.stringify(data)].join(
        "!!"
      );
    } catch(err) {
      console.error(err);
    }
  },
  removePendingRequest(config) {
    const requestKey = this.generateReqKey(config);
    if (this.has(requestKey)) {
      const cancel = this.get(requestKey);
      this.delete(requestKey);
      cancel && cancel("cancel request " + requestKey);
    }
  }
};

export default repeatXhr;
