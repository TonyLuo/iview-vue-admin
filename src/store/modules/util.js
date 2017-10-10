import * as types from '../mutation-types';
const state = {
  storage: sessionStorage
};
const actions = {
  changeStorage: function({commit}, rememberMe) {
    localStorage.setItem('rememberMe', rememberMe);
    // localStorage.removeItem("rememberMe"); //undefined

    commit(types.SET_STORAGE, rememberMe);
  }
};

const mutations = {
  [types.SET_STORAGE]: (state, rememberMe) => {
    if (rememberMe) {
      state.storage = localStorage;
    } else {
      state.storage = sessionStorage;
    }
  }
};
export default {
  state,
  mutations,
  actions
};
