import store from 'src/vuex/store'
import des from './des'
import {
  base64,
  cookie
} from 'vux'

export default {
  getDefaultToken: function () {
    let clientId = 'C1BC4CCED8B544FC15268B8F29CB0386',
      clientSecret = '8F3D3BF3E3EA2895CD7E8E6173385AC57A39C27870714B66';
    return "Basic " + base64.encode(clientId + ":" + clientSecret);
  },
  resetLogin: function () {
    cookie.remove('Author');
    localStorage.removeItem('userInfo');
    store.commit('COM_Token', this.getDefaultToken());
  },
  setLogin: function (token) {
    cookie.set('Author', "Bearer " + token, {
      expires: 1
    });
    store.commit('COM_Token', "Bearer " + token);
  },
  getCookie: function (name) {
    return cookie.get(name);
  },
  setCookie: function (name, value, options) {
    cookie.set(name, value, {
      expires: options
    })
  },
  //删除所有cookie
  clearAllCookie: function () {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--;)
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
  },

  jsDecrypt: function (value) { //解密
    return des.jsdecrypt('ylrj', value);
  },
  jsEncrypt: function (value) { //加密
    return des.jsencrypt('ylrj', value);
  },
  splitValue: function (value) {//分割日期
    let split = value.split('-')
    let year = parseInt(split[0], 10)
    let month = parseInt(split[1], 10)
    return {
      year,
      month,
      days: new Date(year, month, 0).getDate()
    }
  }
}
