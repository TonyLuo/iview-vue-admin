import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from '../plugins/logger'

import storage from './modules/storage'
import layout from './modules/layout'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  actions,
  getters,
  modules: {
    storage,
    layout,
    user
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
