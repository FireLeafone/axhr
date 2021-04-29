import xhr from '../src/index';
import './xhr.config';
import { getAjaxRequest } from './helper'

describe('xhr test', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  it('null config test', done => {
    xhr().catch(err => {
      expect(err).toBe('config is null')
      done();
    });
  });

  it('base config and api call test', done => {
    var response = null;
    var mockSuccess = null;
    var mockError = jest.fn();
    var mockFn1 = null;
    var mockFn2 = null;
    function callback(ds, resp) {
      response = resp;
      mockSuccess = jest.fn(() => 1)();
      expect(ds.data.foo).toBe('bar')
    }

     // 注意执行顺序
     xhr.before = () => {
      mockFn1 = jest.fn(() => 3)();
    };

    xhr.error = (err) => {
      console.log(err)
      mockError();
    };

    xhr.end = () => {
      mockFn2 = jest.fn(() => 4)();
      expect(response.status).toBe(200)
      expect(response.statusText).toBe('OK')
      expect(response.headers['content-type']).toBe('application/json')
      expect(mockSuccess).toBe(1);
      expect(mockError).toHaveBeenCalledTimes(0);
      expect(mockFn1).toBe(3);
      expect(mockFn2).toBe(4);
      done()
    };

    const options = {
      url: '/foo',
      data: {
        username: 'admin'
      },
      success: (res, resp) => callback(res, resp),
      error: (err) => {
        mockError();
      }
    };

    xhr(options);

    getAjaxRequest().then(request => {
      // console.log(request.requestHeaders);
      expect(request.url).toEqual(expect.stringContaining('/api/foo'))
      expect(request.url).toEqual(expect.stringContaining('t='))
      expect(request.url).toEqual(expect.stringContaining('username=admin'))
      expect(request.method).toBe('GET')
      // expect(request.requestHeaders['Content-Type']).toBe('application/json; charset=UTF-8')
      expect(request.requestHeaders['ticket']).toBe('xxx')
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"code": "200", "data": {"foo": "bar"}}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })
  });

  it('config props test', done => {
    var mockFn = jest.fn();
    var mockError = jest.fn();
    function callback(ds) {
      mockFn();
      expect(ds.data.foo).toBe('bar')
    }
    const options = {
      url: '/foo',
      baseUrl: '/test',
      type: 'POST',
      data: {username: 'admin'},
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      config: {
        timeout: 20000
      },
      success: (res) => callback(res),
      error: () => {
        mockError();
      }
    };

    xhr.error = (err) => {
      console.log(err)
      mockError();
    };
    xhr.end = () => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockError).toHaveBeenCalledTimes(0);
      done();
    }

    xhr(options);
    getAjaxRequest().then(request => {
      const params = JSON.parse(request.params);
      expect(request.url).toEqual(expect.stringContaining('/test/foo'))
      expect(params['username']).toEqual('admin')
      expect(request.method).toBe('POST')
      expect(request.requestHeaders['Content-Type']).toBe('application/json; charset=UTF-8')
      expect(request.requestHeaders['ticket']).toBe('xxx')
      expect(request.timeout).toBe(20000)
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"code": "200", "data": {"foo": "bar"}}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })
  });

  it('xhr code error', done => {
    var mockSuccess = jest.fn();
    var mockError = jest.fn();
    const options = {
      type: 'POST',
      data: {username: 'admin'},
      url: 'errXhr',
      success: () => {
        mockSuccess();
      },
      error: (err) => {
        expect(err.message).toBe("code error")
        mockError();
      }
    };

    xhr.error = (err) => {
      console.log(err)
    };
    xhr.end = () => {
      expect(mockSuccess).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(1);
      done();
    }

    xhr(options);

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"code": "300", "message": "code error"}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })
  });

  it('xhr server error', done => {
    var mockSuccess = jest.fn();
    var mockError = jest.fn();
    var mockError2 = jest.fn();
    const options = {
      type: 'GET',
      url: 'errXhr',
      success: () => {
        mockSuccess();
      },
      error: (err) => {
        mockError();
      }
    };

    xhr.error = (err) => {
      // console.log(err)
      expect(err.response.status).toBe(500)
      mockError2();
    };
    xhr.end = () => {
      expect(mockSuccess).toHaveBeenCalledTimes(0);
      expect(mockError).toHaveBeenCalledTimes(1);
      expect(mockError2).toHaveBeenCalledTimes(1);
      done();
    }

    xhr(options);

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500,
      })
    })
  });

  it('xhr FormData', done => {
    var mockFn = jest.fn();
    var mockError = jest.fn();
    function callback(ds) {
      mockFn();
      expect(ds.data.foo).toBe('bar')
    }
    const options = {
      type: 'POST',
      baseUrl: '/test',
      url: '/upload',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      config: {
        timeout: 30000
      },
      data: {username: 'admin'},
      success: (res) => callback(res),
      error: () => {
        mockError();
      }
    };

    xhr.error = (err) => {
      console.log(err)
      mockError();
    };
    xhr.end = () => {
      expect(mockFn).toHaveBeenCalled();
      expect(mockError).toHaveBeenCalledTimes(0);
      done();
    }

    xhr(options);

    getAjaxRequest().then(request => {
      // console.log(request.requestHeaders)
      const params = request.params;
      expect(request.url).toEqual(expect.stringContaining('/test/upload'))
      expect(params.get('username')).toEqual('admin')
      expect(request.method).toBe('POST')
      // expect(request.requestHeaders['Content-Type']).toBe('multipart/form-data')
      expect(request.requestHeaders['ticket']).toBe('xxx')
      expect(request.timeout).toBe(30000)
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"code": "200", "data": {"foo": "bar"}}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })
  });

  it('handle cancel xhr', done => {
    var mockFn = jest.fn();
    var mockError = jest.fn();
    const options = {
      url: '/foo',
      success: () => {
        mockFn();
      },
      error: () => {
        mockError();
      }
    };

    xhr.error = (err) => {
      expect(err.message).toBe('cancel request /foo')
      mockError();
    };
    xhr.end = () => {
      expect(mockFn).not.toHaveBeenCalled();
      expect(mockError).toHaveBeenCalledTimes(2);
      done();
    }

    xhr(options);

    getAjaxRequest().then(request => {
      expect(request.url).toEqual(expect.stringContaining('/api/foo'))
      expect(request.method).toBe('GET')
      expect(request.requestHeaders['ticket']).toBe('xxx')
      expect(request.timeout).toBe(10000)
      setTimeout(() => {
        request.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{"code": "200", "data": {"foo": "bar"}}',
          responseHeaders: {
            'Content-Type': 'application/json'
          }
        })
      }, 300)
      xhr.cancelXhr('/foo');
    })
  });

  it('repeat cancel xhr', done => {
    var mockFn = jest.fn();
    var mockError = jest.fn();
    var isRepeat = false;
    const options = {
      url: '/foo',
      config: {
        noRepeat: true,
        cancelToken: true
      },
      success: () => {
        mockFn();
      },
      error: () => {
        mockError();
      }
    };

    xhr.error = (err) => {
      mockError();
      expect(err.message).toEqual(expect.stringContaining('cancel request'))
      expect(err.message).toEqual(expect.stringContaining('get!!/foo!!'))
    };
    xhr.end = () => {
      if (isRepeat) {
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledTimes(2);
        done()
      }
      isRepeat = !isRepeat;
    }

    xhr.getUrl = null;

    xhr(options);

    getAjaxRequest().then(request => {
      expect(request.url).toEqual(expect.stringContaining('/foo'))
      expect(request.method).toBe('GET')
      expect(request.requestHeaders['ticket']).toBe('xxx')
      expect(request.timeout).toBe(10000)
      // 第一次请求延迟1s
      setTimeout(() => {
        request.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{"code": "200", "data": {"foo": "bar"}}',
          responseHeaders: {
            'Content-Type': 'application/json'
          }
        })
      }, 1000)
    })

    setTimeout(() => {
      xhr(options);

      getAjaxRequest().then(request => {
        expect(request.url).toEqual(expect.stringContaining('/foo'))
        expect(request.method).toBe('GET')
        expect(request.requestHeaders['ticket']).toBe('xxx')
        expect(request.timeout).toBe(10000)
        request.respondWith({
          status: 200,
          statusText: 'OK',
          responseText: '{"code": "200", "data": {"foo": "bar"}}',
          responseHeaders: {
            'Content-Type': 'application/json'
          }
        })
      })

    }, 100)
  });
});
