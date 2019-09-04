import xhr from '../src/index';

describe('base xhr', () => {
  it('base url config', done => {
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
      baseUrl: "https://easy-mock.com/mock/5d3d72c93754634e08f8aecd/axhr/",
      data: {
        userName: 'NARUTOne'
      },
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      success: (res) => callback(res)
    };

    xhr(options);
  }, 1000);
});