export function getAjaxRequest() {
  return new Promise(function (resolve) {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent());
    }, 0);
  });
}
