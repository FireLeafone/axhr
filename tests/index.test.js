import xhr from '../src/index';
import "../mock/index.js";
import './xhr.config';

describe('async xhr', () => {
  it('default get config', done => {
    function callback(data) {
      expect(data.code).toBe(200);
      expect(data.message).toBe('get success');
      done();
    }
    xhr({
      url: 'getUser',
      success: (res) => callback(res)
    });
  });

  it('post config', done => {
    function callback(data) {
      expect(data.code).toBe('000000');
      expect(data.message).toBe('post success');
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
  });
  it('xhr error', done => {
    function callback(data) {
      expect(data.code).toBe(300);
      expect(data.message).toBe('xhr error');
      done();
    }
    xhr({
      type: 'GET',
      url: 'errXhr',
      error: (res) => callback(res)
    });
  });
  it('xhr FormData', done => {
    function callback(data) {
      expect(data.code).toBe('000000');
      expect(data.message).toBe('file success');
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
  });
  it('cancel xhr', done => {
    function callback(data) {
      expect(data.code).toBe(401);
      expect(data.message).toBe('cancel xhr');
      done();
    }
    xhr({
      url: 'getUser',
      success: (res) => callback(res)
    });

    setTimeout(() => {
      xhr.cancelXhr();
      callback({code: 401, message: 'cancel xhr'});
    }, 100);
  });
});