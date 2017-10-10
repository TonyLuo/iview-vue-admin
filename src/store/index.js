import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from '../plugins/logger'

import util from './modules/util'
import layout from './modules/layout'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  actions,
  getters,
  modules: {
    util,
    layout,
    user
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
