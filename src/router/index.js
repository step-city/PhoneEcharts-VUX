import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Homepage from '../pages/homePage/Homepage.vue'
import NewsList from '../pages/systeminfo/NewsList.vue'
import Page404 from '../components/Page404.vue'

import recieveWarning from '../pages/materialWarning/recieve/recieveWarning.vue'
import deliveryWarning from '../pages/materialWarning/delivery/deliveryWarning.vue'

import poundRecieve from '../pages/receiveSendInfo/poundInfo/poundRecieve.vue'
import PDARecieve from '../pages/receiveSendInfo/PDA/PDARecieve.vue'
import concreteInfo from '../pages/receiveSendInfo/concreteInfo/concreteInfo.vue'
import rebarInfo from '../pages/receiveSendInfo/rebarInfo/rebarInfo.vue'
import inventoryInfo from '../pages/Inventory/inventoryInfo.vue'
import turnoverMaterials from '../pages/receiveSendInfo/turnoverMaterials/turnoverMaterials.vue'

import recieveReport from '../pages/queryStatistic/receiveReport/recieveReport.vue'
import deliveryReport from '../pages/queryStatistic/deliveryReport/deliveryReport.vue'

import concreteAnalysis from '../pages/concreteAccounting/concreteAnalysis.vue'
import materialAnalysis from '../pages/concreteAccounting/materialAnalysis.vue'
import stockInventory from '../pages/concreteAccounting/stockInventory.vue'

import rebarAnalysis from '../pages/rebarAccounting/rebarAnalysis.vue'
import rebarCenter from '../pages/rebarAccounting/rebarCenter.vue'

const routes = [
      { path: '/', redirect: "/login" },//重定向  
      { path: '/login', component: Login },
      { path: '/home', component: Home, name: '工作台', meta: { requireMenue: true } },
      {
            path: '/homepage', component: Homepage, meta: { requireMenue: false },
            children: [
                  { path: ':tableName', component: Homepage, meta: { children: true } },
            ]
      },
      { path: '/newsList', component: NewsList, name: '微应用', meta: { requireMenue: true } },

      { path: '/recieveWarning', component: recieveWarning, name: '收料预警', meta: { requireMenue: false } },
      { path: '/deliveryWarning', component: deliveryWarning, name: '发料预警', meta: { requireMenue: false } },

      { path: '/poundRecieve', component: poundRecieve, name: '过磅收料', meta: { requireMenue: false } },
      { path: '/PDARecieve', component: PDARecieve, name: 'PDA收发料', meta: { requireMenue: false } },
      { path: '/concreteInfo', component: concreteInfo, name: '混凝土收发', meta: { requireMenue: false } },
      { path: '/rebarInfo', component: rebarInfo, name: '钢筋发放', meta: { requireMenue: false } },
      { path: '/turnoverMaterials', component: turnoverMaterials, name: '周转材料管理', meta: { requireMenue: false } },

      { path: '/inventoryInfo', component: inventoryInfo, name: '库存信息', meta: { requireMenue: false } },

      { path: '/recieveReport', component: recieveReport, name: '收料报表', meta: { requireMenue: false } },
      { path: '/deliveryReport', component: deliveryReport, name: '发料报表', meta: { requireMenue: false } },

      { path: '/concreteAnalysis', component: concreteAnalysis, name: '混凝土节超分析', meta: { requireMenue: false } },
      { path: '/materialAnalysis', component: materialAnalysis, name: '原材料节超分析', meta: { requireMenue: false } },
      { path: '/stockInventory', component: stockInventory, name: '机楼料仓库存', meta: { requireMenue: false } },

      { path: '/rebarAnalysis', component: rebarAnalysis, name: '钢筋节超分析', meta: { requireMenue: false } },
      { path: '/rebarCenter', component: rebarCenter, name: '钢筋加工中心分析', meta: { requireMenue: false } },

      { path: '/*', component: Page404, name: '页面不存在', meta: { requireMenue: false } }
];


export default routes;