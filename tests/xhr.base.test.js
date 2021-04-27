import xhr from '../src/index';

describe('base xhr', () => {
  it('base url config', done => {
    var mockFn = jest.fn();
    var mockFn1 = jest.fn();
    var mockFn2 = jest.fn();
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
      baseUrl: "https://easy-mock.com/mock/5d3d72c93754634e08f8aecd/axhr/",
      data: {
        userName: 'NARUTOne'
      },
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      success: (res) => callback(res)
    };

    xhr(options);
    xhr.before = () => {
      mockFn1();
      expect(mockFn1).toBeCalled();
    };
    xhr.end = () => {
      mockFn2();
      expect(mockFn2).toBeCalled();
    };
  }, 1000);
});
