import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {//在Store实例中将各个模块组装起来
        user
    }
})