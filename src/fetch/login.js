import fetch from './fetch';

export default {
  GetToken(params) {
    return fetch({
      url: '/Token',
      method: 'post',
      data: params
    })
  },
  requestUpdateCurrentUserInfo(params) {//切换角色
    return fetch({
      url: '/api/services/app/session/UpdateCurrentUserInfo',
      method: 'post',
      data: params
    })
  },
  requestGetCurrentLoginInformations(params) {//获取用户信息
    return fetch({
      url: '/api/services/app/session/GetCurrentLoginInformations',
      method: 'post',
      data: params
    })
  }
}
