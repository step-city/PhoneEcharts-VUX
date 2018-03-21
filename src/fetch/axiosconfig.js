import axios from 'axios'
import stores from '../vuex/store'

// axios 配置
axios.defaults.timeout = 50000;
axios.defaults.headers.post['Content-Type'] = 'application/json'
// 'application/x-www-form-urlencoded';
if (stores.getters.getUrlData && stores.getters.getUrlData !==null) {
  axios.defaults.baseURL = stores.getters.getUrlData;
} else {
  axios.defaults.baseURL = 'http://1.195.30.81:8989';
}

//POST传参序列化
axios.interceptors.request.use((config) => {
  stores.commit('updateLoadingStatus', {isLoading: true})
  if (stores.getters.getToken) {
    config.headers.Authorization = stores.getters.getToken;
  }
  return config;
}, (error) => {
  stores.commit('updateLoadingStatus', {isLoading: false})
  return Promise.reject('错误', error);
});

//返回状态判断
axios.interceptors.response.use((res) => { //配置请求回来的信息 
  stores.commit('updateLoadingStatus', {isLoading: false})
  return res.data;
}, (error) => {
  stores.commit('updateLoadingStatus', {isLoading: false})
  return Promise.reject(error);
});

export default axios
