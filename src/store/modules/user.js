import * as types from '../mutation-types'
import storage from './storage'
import user from '../../api/user.api'

const state = {
  userDetail: {},
  token: {},
  userId: null
}
// getters
const getters = {
  token: state => {
    // check whether the token still valid
    let strToken = storage.state.storage.getItem('userToken')
    let localToken = null
    if (strToken) {
      localToken = JSON.parse(strToken)
    }
    let token = localToken || state.token
    if (token.expiresTime) {
      if (token.expiresTime > new Date().getTime()) {
        return token.userToken
      } else {
        return null
      }
    }
  },
  userDetail: state => {
    return state.userDetail
  },
  roles: state => {
    return state.userDetail.authorities
  }
}

const mutations = {

  [types.SET_USER]: (state, user) => {
    if (user) {
      state.userDetail = user
      state.userId = user.id
      storage.state.storage.setItem('userId', user.id)
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
  initApp({dispatch, commit}, data) {
    dispatch('initUser')

  },
  initUser({dispatch, commit}, data) {
    dispatch('initUserToken', data).then(() => {
      dispatch('setUser')
    })
  },
  setUser({dispatch, commit, state}) {
    if (state.token.userToken) {
      user.getUserInfo().then(res => {
        commit(types.SET_USER, res.data)

      })
    }

  },
  initUserToken({dispatch, commit}, token) {
    // get token through backend api
    if (token && token.id_token) {

      let now = new Date()
      var nowTime = now.getTime()//转化为时间戳毫秒数
      let expiresTime = now.setTime(nowTime + 1000 * token.expires_in - 1000 * 60 * 10)//set expires time 10 minutes advanced 设置比真实失效时间提前十分钟
      let userToken = {userToken: token.id_token, expiresTime: expiresTime} //转成失效时间
      let strToken = JSON.stringify(userToken) //转化为JSON字符串
      storage.state.storage.setItem('userToken', strToken)

      commit(types.SET_USER_TOKEN, userToken)
    }
    else {
      // get token from localStorage/sessionStorage
      let strToken = storage.state.storage.getItem('userToken')
      if (strToken) {
        let localToken = JSON.parse(strToken)
        if (localToken.expiresTime > new Date().getTime()) {
          commit(types.SET_USER_TOKEN, localToken)

        } else {
          commit(types.CLEAR_USER)
        }
      }

    }
  },

  logout({dispatch, commit}) {
    commit(types.CLEAR_USER)

  }

}

export default {
  state,
  getters,
  mutations,
  actions
}
