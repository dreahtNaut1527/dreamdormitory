import Vue from 'vue'
import axios from 'axios'
import md5 from 'md5'
import moment from 'moment'
import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import Vuemask from 'v-mask'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import mixins from './plugins/mixins'

// Vue socket from server 
const url = process.env.NODE_ENV == 'production' ? process.env.VUE_APP_SERVER : process.env.VUE_APP_LOCAL_SERVER

export const SocketInstance = socketio(url)

// Vue config
Vue.config.productionTip = false

// Vue Prototype
Vue.prototype.axios = axios
Vue.prototype.md5 = md5
Vue.prototype.moment = moment

// Vue Use
Vue.use(mixins)
Vue.use(Vuemask)
Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketInstance
}))

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
