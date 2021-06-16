import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hrisUserInfo: {},
    isConnect: true,
    isLoggedIn: false,
  },
  plugins: [
    createPersistedState() 
  ],
  mutations: {
    CHANGE_USER_INFO: (state, data) => {
      state.hrisUserInfo = data
    },
    CHANGE_CONNECTION: (state, data) => {
      state.isConnect = data
    },
    CHANGE_LOGGING: (state, data) => {
      state.isLoggedIn = data
    },
  },
  actions: {

  },
  modules: {

  }
})
