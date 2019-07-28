import xhr from '../src/index';
import './xhr.config';
// import { setup, teardown } from './xhrMock';

describe('axios xhr', () => {
  // beforeEach(() => setup());
  // afterEach(() => teardown());

  it('default get config', done => {
    var mockFn = jest.fn();
    function callback(data) {
      mockFn();
      expect(data.code).toBe(200);
      expect(data.message).toBe('get success');
      expect(mockFn).toBeCalled();
      done();
    }
    const options = {
      url: 'getUser',
      success: (res) => callback(res)
    };

    xhr(options);
  }, 1000);

  it('post config', done => {
    var mockFn = jest.fn();
    function callback(data) {
      mockFn();
      expect(data.code).toBe('000000');
      expect(data.message).toBe('post success');
      expect(mockFn).toBeCalled();
      done();
    }
    const options = {
      type: 'post',
      url: 'getUserByName',
      data: {
        userName: 'NARUTOne'
      },
      success: (res) => callback(res)
    };

    xhr(options);
  }, 1000);

  it('xhr error', done => {
    var mockFn = jest.fn();
    function callback(data) {
      mockFn();
      expect(data.code).toBe(300);
      expect(data.message).toBe('xhr error');
      expect(mockFn).toBeCalled();
      done();
    }
    const options = {
      type: 'GET',
      url: 'errXhr',
      error: (res) => callback(res)
    };
    xhr(options);
  }, 1000);

  // todo
  // it('xhr FormData', done => {
  //   var mockFn = jest.fn();
  //   function callback(res) {
  //     console.log(res);
  //     mockFn();
  //     expect(mockFn).toBeCalled();
  //     done();
  //   }
  //   var formData = new FormData();
  //   formData.append('userName', 'NARUTOne');
  //   const options = {
  //     type: 'post',
  //     url: '',
  //     baseUrl: "http://upload.com/",
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     data: formData,
  //     success: (res) => callback(res),
  //     error: (err) => console.log(err)
  //   };
  //   xhr(options);
  // });

  it('cancel xhr', done => {
    var mockFn = jest.fn();
    function callback(data) {
      expect(data.code).toBe(401);
      expect(data.message).toBe('cancel xhr');
      expect(mockFn).toBeCalledTimes(0);
      done();
    }
    const options = {
      url: 'getUser',
      success: (res) => {
        mockFn();
        callback(res);
      }
    };

    xhr(options);

    setTimeout(() => {
      xhr.cancelXhr();
      callback({code: 401, message: 'cancel xhr'});
    }, 0);
  }, 1000);
});