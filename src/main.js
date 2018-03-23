// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

const FastClick = require('fastclick')
FastClick.attach(document.body)

import VCharts from 'v-charts'
import routes from './router'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
Vue.use(VCharts)


import store from './vuex/store'
store.registerModule('vux', {
  state: {
    isLoading: false,
    direction: 'forward'
  },
  mutations: {
    updateLoadingStatus(state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection(state, payload) {
      state.direction = payload.direction
    }
  }
})
import {
  ConfirmPlugin,
  LoadingPlugin,
  AlertPlugin,
  ToastPlugin,
  cookie
} from 'vux'

Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

const router = new VueRouter({
  // mode: 'history', //'hash'
  routes
})


// simple history management
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/login', 0)
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

document.addEventListener('touchend', () => {
  endTime = Date.now()
})
methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
})


router.beforeEach((to, from, next) => {
  store.commit('updateLoadingStatus', {
    isLoading: true
  })
  if (JSON.parse(localStorage.getItem('userInfo')) == null && to.path !== '/login') {
    if (!to.meta.requireToken) {
      router.replace("/login");
    }
  }
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {
        direction: 'forward'
      })
    } else {
      if (!isPush && (Date.now() - endTime) < 377) {
        store.commit('updateDirection', {
          direction: ''
        })
      } else {
        store.commit('updateDirection', {
          direction: 'reverse'
        })
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/login' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {
      direction: 'forward'
    })
  }
  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})
router.afterEach(function (to) {
  isPush = false
  store.commit('updateLoadingStatus', {
    isLoading: false
  })
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

let token = cookie.get('Author')
if (token) {
  store.commit("COM_Token", token)
}


