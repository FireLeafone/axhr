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

/** 
 * @param {any} paramsString 
 * @returns 
 */
function param2Obj (paramsString) {
  const search = paramsString;
  if (!search) {
    return {};
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
}

const getUser = () => {
  return {
    code: 200,
    data: userMap.admin,
    message: 'get success'
  };
};

const getUserByName = config => {
  const body = param2Obj(config.body);
    const {userName} = body;

  if (!body) {
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

const errXhr = () => {
  return {
    code: 300,
    message: 'xhr error'
  };
};

const fileXhr = () => {
  return {
    code: '000000',
    message: 'file success'
  };
};

Mock.mock(/\/api\/errXhr/, 'get', errXhr);
Mock.mock(/\/api\/getUser/, 'get', getUser);
Mock.mock(/\/api\/getUserByName/, 'post', getUserByName);
Mock.mock(/\/api\/fileXhr/, 'post', fileXhr);