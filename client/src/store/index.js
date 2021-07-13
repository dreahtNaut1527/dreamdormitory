import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appVersion: null,
    payrollDate: null,
    cutOffDate: [],
    hrisUserInfo: {},
    hrsys: {},
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
    CHANGE_PAYROLLDATE: (state, data) => {
      state.payrollDate = data
    },
    CHANGE_CUTOFFDATE: (state, data) => {
      state.cutOffDate = data
    },
    CHANGE_HRSYS: (state, data) => {
      state.hrsys = data
    }
  },
  actions: {

  },
  modules: {

  }
})
