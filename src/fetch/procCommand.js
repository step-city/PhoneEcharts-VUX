import fetch from  './fetch';

export default {
  requestProcCommand(params) {//执行存储过程
    return fetch({ 
      url: '/api/services/app/sqlExecute/ExecuteSqlAndProcCommand',
      method: 'post',
      data: params
  })
    },
    requestOrganize(params) {//获取组织机构树
      return fetch({ 
        url: '/api/services/app/organize/GetOrganizes',
        method: 'post',
        data: params
    })
    },
    fetchSupplier(params) { //过磅收料供应商
      return fetch({ 
        url: '/api/services/app/commonSupplier/getMainPageList',
        method: 'post',
        data: params
    })
    },
}