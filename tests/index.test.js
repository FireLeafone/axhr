import xhr from '../src/index';
import "../mock/index";
import './xhr.config';

describe('async xhr', () => {
  it('default get config', done => {
    var mockFn = jest.fn();
    function callback(data) {
      mockFn();
      expect(data.code).toBe(200);
      expect(data.message).toBe('get success');
      expect(mockFn).toBeCalled();
      done();
    }
    xhr({
      url: 'getUser',
      success: (res) => callback(res)
    });
  }, 10000);

  it('post config', done => {
    var mockFn = jest.fn();
    function callback(data) {
      mockFn();
      expect(data.code).toBe('000000');
      expect(data.message).toBe('post success');
      expect(mockFn).toBeCalled();
      done();
    }
    xhr({
      type: 'post',
      url: 'getUserByName',
      data: {
        userName: 'NARUTOne'
      },
      success: (res) => callback(res)
    });
  }, 10000);

  it('xhr error', done => {
    var mockFn = jest.fn();
    function callback(data) {
      mockFn();
      expect(data.code).toBe(300);
      expect(data.message).toBe('xhr error');
      expect(mockFn).toBeCalled();
      done();
    }
    xhr({
      type: 'GET',
      url: 'errXhr',
      error: (res) => callback(res)
    });
  }, 10000);

  it('xhr FormData', done => {
    var mockFn = jest.fn();
    function callback(data) {
      mockFn();
      expect(data.code).toBe('000000');
      expect(data.message).toBe('file success');
      expect(mockFn).toBeCalled();
      done();
    }
    var formData = new FormData();
    formData.append('userName', 'NARUTOne');
    xhr({
      type: 'post',
      url: 'fileXhr',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData,
      success: (res) => callback(res)
    });
  }, 10000);

  it('cancel xhr', done => {
    var mockFn = jest.fn();
    function callback(data) {
      expect(data.code).toBe(401);
      expect(data.message).toBe('cancel xhr');
      expect(mockFn).toBeCalledTimes(0);
      done();
    }
    xhr({
      url: 'getUser',
      success: (res) => {
        mockFn();
        callback(res);
      }
    });

    setTimeout(() => {
      xhr.cancelXhr();
      callback({code: 401, message: 'cancel xhr'});
    }, 100);
  }, 10000);
});