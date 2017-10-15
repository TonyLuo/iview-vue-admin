// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import App from './App'
import store from './store'
import util from './libs/util'
import { routers } from './router'

import formType from './components/form-type'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(iView)
Vue.use(formType)

Vue.config.productionTip = false


function guardRoute (route, redirect, next) {
  if (window.confirm(`Navigate to ${route.path}?`)) {
    next()
  } else if (window.confirm(`Redirect to /baz?`)) {
    redirect('/baz')
  }
}

// 路由配置
const RouterConfig = {
  mode: 'hash',
  routes: routers
}
const router = new VueRouter(RouterConfig)

router.beforeEach((route, redirect, next) => {
  iView.LoadingBar.start()
  util.title(route.meta.title)

  if (route.matched.some(m => m.meta.needGuard)) {
    guardRoute(route, redirect, next)
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
})
