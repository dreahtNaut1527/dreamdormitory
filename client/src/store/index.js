import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appVersion: null,
    hrisUserInfo: {},
    darkMode: false,
    isConnect: true,
    isLoggedIn: false,
    themeColor: '#1976d2',
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
    CHANGE_DARKMODE: (state, data) => {
      state.darkMode = data
    },
    CHANGE_THEMECOLOR: (state, data) => {
      state.themeColor = data
    },
    CHANGE_APP_VERSION: (state, data) => {
      state.appVersion = data
    },
  },
  actions: {

  },
  modules: {

  }
})
