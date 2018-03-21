import * as types from '../types'
import {
  cookie
} from 'vux'

const state = {
  userInfo: JSON.parse(localStorage.getItem('userInfo')),
  urlData: JSON.parse(localStorage.getItem('urlData')),
  com_Token: cookie.get('Author'),
  rangeInfo: JSON.parse(localStorage.getItem('rangeInfo'))
}

const actions = { //Action 通过 store.dispatch 方法触发
  setRangeInfo({ commit }, status) {
    localStorage.setItem('rangeInfo', JSON.stringify(status))
    commit(types.SET_RANGE_INFO, status)
  },
  getToken({
    commit
  }, status) {
    commit(types.COM_Token, status)
  },
  setUserInfo({
    commit
  }, res) { //用户信息
    localStorage.setItem('userInfo', JSON.stringify(res))
    commit(types.SET_USER_INFO, res)
  },
  getUrlData({
    commit
  }, params) { //请求网址信息
    localStorage.setItem('urlData', JSON.stringify(params))
    commit(types.GET_URL_DATA, params)

  }

}

const getters = {
  rangeInfo: state => state.rangeInfo,
  getUrlData: state => state.urlData,
  userInfo: state => state.userInfo,
  getToken: status => status.com_Token
}

const mutations = {

  [types.SET_RANGE_INFO](state, res) {
    state.rangeInfo = res
  },

  [types.COM_Token](state, res) {
    state.com_Token = res
  },

  [types.SET_USER_INFO](state, res) {
    state.userInfo = res
  },

  [types.GET_URL_DATA](state, res) {
    state.urlData = res
  }

}

export default {
  state,
  actions,
  getters,
  mutations
}
