export const isObject = (obj: any) =>
  Object.prototype.toString.call(obj) === '[object Object]';
export const isArray = (arr: any) =>
  Object.prototype.toString.call(arr) === '[object Array]';

export const DEFAULT_VALUE = {};

export function setData(params: any) {
  let sendData = params;
  if (isObject(sendData)) {
    sendData = { ...sendData };
    sendData = Object.keys(sendData)
      .map((key) => {
        let value = sendData[key];
        if (isArray(value) || isObject(value)) {
          value = JSON.stringify(value);
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  } else {
    return DEFAULT_VALUE;
  }
  return sendData;
}
