import xhr, { type XhrOptions } from '../src/index';
import './xhr.config';
import { getAjaxRequest } from './helper';

describe('xhr test', () => {
  beforeEach(() => {
    jest.setTimeout(10000);
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jasmine.Ajax.uninstall();
  });

  it('null config test', (done) => {
    xhr.request().catch((err) => {
      expect(err).toBe('config is null');
      done();
    });
  });

  it('base config and api call test', (done) => {
    let response: any = null;
    let mockSuccess: any = null;
    let mockError = jest.fn();
    let mockFn1: any = null;
    let mockFn2: any = null;
    function callback(ds: any, resp: any) {
      response = resp;
      mockSuccess = jest.fn(() => 1)();
      expect(ds.data.foo).toBe('bar');
    }

    // 注意执行顺序
    xhr.before = () => {
      mockFn1 = jest.fn(() => 3)();
    };

    xhr.error = (err) => {
      console.log('error', err);
      mockError();
    };

    xhr.end = (_res, isError) => {
      if (isError) {
        expect(mockError).toHaveBeenCalledTimes(1);
        done();
        return;
      }
      mockFn2 = jest.fn(() => 4)();
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.headers['content-type']).toBe('application/json');
      expect(mockSuccess).toBe(1);
      expect(mockError).toHaveBeenCalledTimes(0);
      expect(mockFn1).toBe(3);
      expect(mockFn2).toBe(4);
      done();
    };

    const options: XhrOptions = {
      url: '/foo',
      data: {
        username: 'admin',
      },
      success: (res: any, resp: any) => callback(res, resp),
      error: () => {
        mockError();
      },
    };

    xhr.request(options);
    getAjaxRequest().then((request: any) => {
      console.log('getAjaxRequest', request);
      expect(request.url).toContain('/api/foo');
      expect(request.url).toContain('t=');
      expect(request.url).toContain('username=admin');
      expect(request.method).toBe('GET');
      // expect(request.requestHeaders['Content-Type']).toBe('application/json; charset=UTF-8')
      expect(request.requestHeaders['ticket']).toBe('xxx');
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"code": "200", "data": {"foo": "bar"}}',
        responseHeaders: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  it('config props test', (done) => {
    var mockFn = jest.fn();
    var mockError = jest.fn();
    function callback(ds: any) {
      mockFn();
      expect(ds.data.foo).toBe('bar');
    }
    const options = {
      url: '/foo',
      baseUrl: '/test',
      type: 'POST',
      data: { username: 'admin' },
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      config: {
        timeout: 20000,
      },
      success: (res: any) => callback(res),
      error: () => {
        mockError();
      },
    };

    xhr.error = (err) => {
      console.log(err);
      mockError();
    };
    xhr.end = () => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockError).toHaveBeenCalledTimes(0);
      done();
    };

    xhr.request(options);
    getAjaxRequest().then((request: any) => {
      const params = JSON.parse(request.params);
      expect(request.url).toContain('/test/foo');
      expect(params['username']).toEqual('admin');
      expect(request.method).toBe('POST');
      expect(request.requestHeaders['Content-Type']).toBe(
        'application/json; charset=UTF-8',
      );
      expect(request.requestHeaders['ticket']).toBe('xxx');
      expect(request.timeout).toBe(20000);
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"code": "200", "data": {"foo": "bar"}}',
        responseHeaders: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  it('xhr code error', (done) => {
    var mockSuccess = jest.fn();
    var mockError = jest.fn();
    const options = {
      type: 'POST',
      data: { username: 'admin' },
      url: 'errXhr',
      success: () => {
        mockSuccess();
      },
      error: (err: any) => {
        expect(err.message).toBe('code error');
        mockError();
      },
    };

    xhr.error = (err) => {
      console.log(err);
    };
    xhr.end = () => {
      expect(mockSuccess).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(1);
      done();
    };

    xhr.request(options);
    getAjaxRequest().then((request: any) => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"code": "300", "message": "code error"}',
        responseHeaders: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  it('xhr server error', (done) => {
    var mockSuccess = jest.fn();
    var mockError = jest.fn();
    var mockError2 = jest.fn();
    const options = {
      type: 'GET',
      url: 'errXhr',
      success: () => {
        mockSuccess();
      },
      error: () => {
        mockError();
      },
    };

    xhr.error = (err: any) => {
      // console.log(err)
      expect(err.response.status).toBe(500);
      mockError2();
    };
    xhr.end = () => {
      expect(mockSuccess).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError2).toHaveBeenCalledTimes(1);
      done();
    };

    xhr.request(options);
    getAjaxRequest().then((request: any) => {
      request.respondWith({
        status: 500,
      });
    });
  });

  it('xhr FormData', (done) => {
    var mockFn = jest.fn();
    var mockError = jest.fn();
    function callback(ds: any) {
      mockFn();
      expect(ds.data.foo).toBe('bar');
    }
    const options = {
      type: 'POST',
      baseUrl: '/test',
      url: '/upload',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      config: {
        timeout: 30000,
      },
      data: { username: 'admin' },
      success: (res: any) => callback(res),
      error: () => {
        mockError();
      },
    };

    xhr.error = (err) => {
      console.log(err);
      mockError();
    };
    xhr.end = () => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockError).toHaveBeenCalledTimes(0);
      done();
    };

    xhr.request(options);
    getAjaxRequest().then((request: any) => {
      // console.log(request.requestHeaders)
      const params = request.params;
      expect(request.url).toContain('/test/upload');
      expect(params.get('username')).toEqual('admin');
      expect(request.method).toBe('POST');
      // expect(request.requestHeaders['Content-Type']).toBe('multipart/form-data')
      expect(request.requestHeaders['ticket']).toBe('xxx');
      expect(request.timeout).toBe(30000);
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"code": "200", "data": {"foo": "bar"}}',
        responseHeaders: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  it('handle cancel xhr', (done) => {
    var mockFn = jest.fn();
    var mockError = jest.fn();
    var mockCancel = jest.fn();
    var cancelTime = 0;
    const options = {
      url: '/foo',
      cancelMsg: 'cancel /foo',
      config: {
        isCancelToken: true,
      },
      success: () => {
        mockFn();
      },
      error: () => {
        mockError();
      },
      cancel: () => {
        mockCancel();
      },
    };
    const options2 = {
      url: '/foo2',
      cancelMsg: 'cancel /foo2',
      config: {
        isCancelToken: true,
      },
      success: () => {
        mockFn();
      },
      error: () => {
        mockError();
      },
      cancel: () => {
        mockCancel();
      },
    };

    xhr.error = (err, isCancel) => {
      cancelTime += 1;
      if (cancelTime === 1) {
        expect(err).toContain('cancel /foo');
      } else if (cancelTime === 2) {
        expect(err).toContain('cancel /foo2');
      }
      expect(isCancel).toBe(true);
      mockError();
    };
    xhr.end = () => {
      if (cancelTime === 2) {
        expect(mockFn).not.toHaveBeenCalled();
        expect(mockError).toHaveBeenCalledTimes(4);
        expect(mockCancel).toHaveBeenCalledTimes(2);
        done();
      }
    };

    xhr.request(options);
    getAjaxRequest().then((request: any) => {
      expect(request.url).toContain('/api/foo');
      expect(request.method).toBe('GET');
      expect(request.requestHeaders['ticket']).toBe('xxx');
      expect(request.timeout).toBe(10000);
      setTimeout(() => {
        request.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{"code": "200", "data": {"foo": "bar"}}',
          responseHeaders: {
            'Content-Type': 'application/json',
          },
        });
      }, 1000);
      xhr.cancelXhr?.('/foo', ['/foo']);
    });

    setTimeout(() => {
      xhr.request(options2);
      getAjaxRequest().then((request: any) => {
        expect(request.url).toContain('/api/foo2');
        expect(request.method).toBe('GET');
        expect(request.requestHeaders['ticket']).toBe('xxx');
        expect(request.timeout).toBe(10000);
        setTimeout(() => {
          request.respondWith({
            status: 200,
            statusText: 'OK',
            responseText: '{"code": "200", "data": {"foo": "bar"}}',
            responseHeaders: {
              'Content-Type': 'application/json',
            },
          });
        }, 1000);
        xhr.cancelXhr?.('/foo2');
      });
    }, 100);
  });

  it('repeat cancel xhr', (done) => {
    var mockFn = jest.fn();
    var mockError = jest.fn();
    var isRepeat = false;
    const options = {
      url: '/foo',
      config: {
        noRepeat: true,
        isCancelToken: true,
      },
      success: () => {
        mockFn();
      },
      error: () => {
        mockError();
      },
    };

    xhr.error = (err) => {
      mockError();
      expect(err).toContain('cancel request');
      expect(err).toContain('get!!/foo!!');
    };
    xhr.end = () => {
      if (isRepeat) {
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledTimes(2);
        done();
      }
      isRepeat = !isRepeat;
    };

    xhr.getUrl = undefined;

    xhr.request(options);
    getAjaxRequest().then((request: any) => {
      expect(request.url).toContain('/foo');
      expect(request.method).toBe('GET');
      expect(request.requestHeaders['ticket']).toBe('xxx');
      expect(request.timeout).toBe(10000);
      // 第一次请求延迟1s
      setTimeout(() => {
        request.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{"code": "200", "data": {"foo": "bar"}}',
          responseHeaders: {
            'Content-Type': 'application/json',
          },
        });
      }, 1000);
    });

    setTimeout(() => {
      xhr.request(options);
      getAjaxRequest().then((request: any) => {
        expect(request.url).toContain('/foo');
        expect(request.method).toBe('GET');
        expect(request.requestHeaders['ticket']).toBe('xxx');
        expect(request.timeout).toBe(10000);
        request.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{"code": "200", "data": {"foo": "bar"}}',
          responseHeaders: {
            'Content-Type': 'application/json',
          },
        });
      });
    }, 100);
  });
});
