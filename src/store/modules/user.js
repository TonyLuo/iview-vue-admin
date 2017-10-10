import * as types from '../mutation-types'
import util from './util'
import user from '../../api/user'

const state = {
  userDetail: {},
  token: {},
  userId: null
}

const mutations = {

  [types.SET_USER]: (state, user) => {
    if (user) {
      state.userDetail = user
      state.userId = user.id
      util.state.storage.setItem('userId', user.id)
    }
  },
  [types.SET_USER_TOKEN]: (state, token) => {
    if (token && token.userToken) {
      state.token = token
    }

  },
  [types.CLEAR_USER]: (state) => {
    state.userDetail = {}
    state.userId = null
    localStorage.clear()
    sessionStorage.clear()
  }
}
const actions = {
  initUser ({dispatch, commit}, data) {
    dispatch('initUserToken', data).then(() => {
      dispatch('setUser')
    })
  },
  setUser ({dispatch, commit}) {
    user.getUserInfo().then(res => {
      commit(types.SET_USER, res.data)

    })

  },
  initUserToken ({dispatch, commit}, token) {
    // get token through backend api
    if (token && token.id_token) {

      let now = new Date()
      var nowTime = now.getTime()//转化为时间戳毫秒数
      let expiresTime = now.setTime(nowTime + 1000 * token.expires_in - 1000 * 60 * 10 )//设置比真实失效时间提前十分钟
      let userToken = {userToken: token.id_token, expiresTime: expiresTime} //转成失效时间
      let strToken = JSON.stringify(userToken) //转化为JSON字符串
      util.state.storage.setItem('userToken', strToken)

      commit(types.SET_USER_TOKEN, userToken)
    }
    // get token from localStorage/sessionStorage
    else {
      let strToken = util.state.storage.getItem('userToken')
      let localToken = JSON.parse(strToken)
      if(localToken.expiresTime > new Date().getTime()){
        commit(types.SET_USER_TOKEN, localToken)

      }else{
        commit(types.CLEAR_USER)
      }
    }
  },

  logout ({dispatch, commit}) {
    commit(types.CLEAR_USER)

  }

}

export default {
  state,
  mutations,
  actions
}
