/* eslint-disable no-unused-vars */
import * as types from '../mutation-types'
import { appRouter } from '../../router'

// initial state

const state = {
  ready: false,
  routers: [],
  appRouter: [],
  openedMenuNameList: [],
  menuList: [],
  tabList: [],
  pageOpenedList: [],
  currentPath: [],  // 面包屑数组
  menuTheme: null, // 主题
  theme: null
}

// getters
const getters = {}

// actions
const actions = {
  initial ({dispatch, commit, state}, data) {
    dispatch('initLayout').then(() => {
      dispatch('setMenuList').then(() => {
        dispatch('setTabList').then(() => {
          commit(types.SET_LAYOUT_STATUS, true)
        })
      })
    })
  },

  initLayout ({dispatch, commit, state}, data) {
    commit(types.INIT_LAYOUT)
  },
  setMenuList ({dispatch, commit, state}, data) {
    commit(types.SET_MENU_LIST)
  },
  setTabList ({dispatch, commit, state}, data) {
    commit(types.SET_TAB_LIST)
  },
  setCurrentPath ({dispatch, commit, state}, currentPageName) {
    let currentPath = []
    let openedMenuList = state.menuList.filter(menu => {
      if (!menu.children) {
        return menu.name === currentPageName
      }
      else {
        return menu.children.some((child) => {
          if (child.name === currentPageName) {
            currentPath.push(child)
          }

          return child.name === currentPageName
        })
      }
    })

    if (openedMenuList[0] && openedMenuList[0].name !== 'home') {
      let currentNode = {
        title: openedMenuList[0].title,
        // breadcrumb should not show hyperlink if the current node is the parent node
        path: openedMenuList[0].children ? '' : openedMenuList[0].path,
        name: openedMenuList[0].name
      }
      currentPath.push(currentNode)
    }

    commit(types.SET_CURRENT_PATH, currentPath.reverse())

    let openedMenuNameList = openedMenuList.map(item => {
      return item.name
    })

    commit(types.SET_OPENED_MENU_LIST, openedMenuNameList)
  },

  openTab ({dispatch, commit, state}, menuName) {
    commit(types.OPEN_TAB, menuName)
  },
  removeTab ({dispatch, commit, state}, name) {
    commit(types.REMOVE_TAB, name)
  }
}

// mutations
const mutations = {
  [types.SET_MENU_LIST] (state, list) {
    // clear menuList
    // TODO filter menuList according to the user role
    state.menuList = []
    state.menuList = appRouter.slice()
  },
  [types.SET_TAB_LIST] (state) {
    state.menuList.map((item) => {
      if (item.children) {
        state.tabList.push(...item.children)
      } else {
        state.tabList.push(item)
      }
    })
  },
  [types.SET_CURRENT_PATH] (state, currentPath) {

    state.currentPath = currentPath


  },

  [types.SET_OPENED_MENU_LIST] (state, openedMenuNameList) {
    state.openedMenuNameList = openedMenuNameList
  },
  [types.OPEN_TAB] (state, menuName) {
    let tabOpened = state.pageOpenedList.some(item => {
      return item.name === menuName
    })
    if (!tabOpened) {
      let tab = state.tabList.filter((item) => {
        return menuName === item.name
      })[0]
      state.pageOpenedList.push(tab)
    }
  },

  [types.REMOVE_TAB] (state, name) {
    state.pageOpenedList = state.pageOpenedList.filter(item => {
      return item.name !== name
    })
  },
  [types.SET_LAYOUT_STATUS] (state, status) {
    state.ready = status

  },
  [types.INIT_LAYOUT] (state, name) {
    state.appRouter = appRouter.slice()
    state.pageOpenedList = [appRouter[0]]
    state.currentPath = [
      {
        title: '首页',
        path: '',
        name: 'home_index'
      }
    ]
    state.menuTheme = localStorage.menuTheme ? localStorage.menuTheme : 'dark' // 主题
    state.theme = localStorage.theme ? localStorage.theme : 'b'
  },

  changeTheme (state, theme) {
    state.menuTheme = theme
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
