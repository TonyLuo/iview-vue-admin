import * as types from '../mutation-types';
import util from './util';

const state = {
  user: {},
  userId: null
};

const mutations = {

  [types.SET_USER]: (state, user) => {
    if (user) {
      state.user = user;
      state.userId = user.id;
      util.state.storage.setItem('userId', user.id);
    }
  },
  [types.CLEAR_USER]: (state) => {
    state.user = {};
    state.userId = null;
    localStorage.clear();
    sessionStorage.clear();
  }
};
const actions = {
  initialUser({dispatch, commit}, user) {
    if (user) {
      commit(types.SET_USER, user);
    }
  },
  logout({dispatch, commit}) {
    commit(types.CLEAR_USER);

  }

};

export default {
  state,
  mutations,
  actions
};
