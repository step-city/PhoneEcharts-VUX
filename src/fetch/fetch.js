import axios from 'axios';
import stores from '../vuex/store'
import qs from "qs";
import router from '../router/index';

// axios 配置
axios.defaults.timeout = 50000;

export default function fetch(options, axiosConfig = { baseURL: '', authorization: '', formatData: false }) {
  return new Promise((resolve, reject) => {
    if (axiosConfig.baseURL != '') {
      axios.defaults.baseURL = axiosConfig.baseURL;
    } else {
      if (stores.getters.getUrlData && stores.getters.getUrlData !== null) {
        axios.defaults.baseURL = stores.getters.getUrlData;
      } else {
        axios.defaults.baseURL = window.getClientObj().sysConf.url;
      }
    }
    let author = '';
    if (axiosConfig.authorization != '') {
      author = axiosConfig.authorization;
    } else {
      author = stores.getters.getToken;
    }
    //实例化的对象
    const instance = axios.create(author === 'none' ? {} : {
      headers: { 'Authorization': author }
    });
    // 添加请求拦截器     
    instance.interceptors.request.use(function (config) {
      stores.commit('updateLoadingStatus', { isLoading: true })
      // 在发送请求之前做些什么
      if (axiosConfig.formatData) {
        config.data = qs.stringify(config.data);
      }
      return config;

    }, function (error) {
      stores.commit('updateLoadingStatus', { isLoading: false })
      // 对请求错误做些什么
      return Promise.reject(error);
    });
    //添加响应拦截器 
    instance.interceptors.response.use((response) => {
      let data = response.data;
      stores.commit('updateLoadingStatus', { isLoading: false })
      if (data.success == false) {
        if (data.error.code === 400) {
          router.replace('/login')
        }
      }
      return response;
    }, function (error) {
      stores.commit('updateLoadingStatus', { isLoading: false })
      // 对响应错误做点什么
      return Promise.reject(error);
    });

    //初始化配置
    instance(options)
      .then(response => {
        const res = response.data;
        if (response.status !== 200) {
          console.log(res.error); // for debug
          reject(res);
        }
        resolve(res);
      })
      .catch(error => {
        console.log(error); // for debug
        reject(error);
      });
  });
}
