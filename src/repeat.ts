const repeatXhr = {
  pendingRequest: new Map(),
  has(key: string) {
    return this.pendingRequest && this.pendingRequest.has(key);
  },
  get(key: string) {
    if (this.pendingRequest) {
      return this.pendingRequest.get(key);
    }
  },
  set(key: string, val: any) {
    if (this.pendingRequest) {
      this.pendingRequest.set(key, val);
    }
  },
  delete(key: string) {
    if (this.pendingRequest) {
      this.pendingRequest.delete(key);
    }
  },
  generateReqKey(config: any) {
    try {
      const { method, url, params, data } = config;
      return [method, url, JSON.stringify(params), JSON.stringify(data)].join(
        '!!',
      );
    } catch (err) {
      console.error(err);
      return '';
    }
  },
  removePendingRequest(config: any) {
    const requestKey = this.generateReqKey(config);
    if (requestKey && this.has(requestKey)) {
      const cancel = this.get(requestKey);
      this.delete(requestKey);
      cancel && cancel('cancel request ' + requestKey);
    }
  },
};

export default repeatXhr;
