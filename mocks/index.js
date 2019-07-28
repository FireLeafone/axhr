import Mock from 'mockjs';

const userMap = Mock.mock({
  admin: {
    id: '@id',
    userName: 'admin',
    cname: '@cname',
    age: '@integer(10, 30)',
    address: '@county(true)'
  },
  NARUTOne: {
    id: '@id',
    userName: 'NARUTOne',
    cname: '路鸣',
    age: '@integer(10, 20)',
    address: '东海红大陆木叶村'
  }
});

export const getUser = () => {
  return {
    code: 200,
    data: userMap.admin,
    message: 'get success'
  };
};

export const getUserByName = params => {
  const {userName} = params;

  if (!params) {
    return {
      code: 201,
      data: [],
      message: 'not have params'
    };
  }

  return {
    code: '000000',
    data: userMap[userName],
    message: 'post success'
  };
};

export const errXhr = () => {
  return {
    code: 300,
    message: 'xhr error'
  };
};

export const fileXhr = () => {
  return {
    code: '000000',
    message: 'file success'
  };
};

export default {
  '/api/errXhr/get': () => errXhr(),
  '/api/getUser/get': () => getUser(),
  '/api/getUserByName/post': (params) => getUserByName(params),
  '/api/fileXhr/post': () => fileXhr(),
};
