import Vue from 'vue'
import axios from 'axios'
import md5 from 'md5'
import moment from 'moment'
import Swal from 'sweetalert2'
import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import Vuemask from 'v-mask'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import mixins from './plugins/mixins'
import indexDB from './plugins/indexDB'
import exportExcel from './print/exportexcel'

// Vue socket from server side
const url = process.env.NODE_ENV == 'production' ? process.env.VUE_APP_SERVER : process.env.VUE_APP_LOCAL_SERVER

export const SocketInstance = socketio(url)

// Vue config
Vue.config.productionTip = false

// Vue Prototype
Vue.prototype.axios = axios
Vue.prototype.md5 = md5
Vue.prototype.moment = moment
Vue.prototype.Swal = Swal
Vue.prototype.exportExcel = exportExcel

// Vue Use
// Vue.use(Swal)
Vue.use(mixins)
Vue.use(indexDB)
Vue.use(Vuemask)
Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketInstance
}))

new Vue({
  router,
  store,
  vuetify,
  sockets: {
       connect() {
            store.commit('CHANGE_CONNECTION', true)
       },
       disconnect() {
            store.commit('CHANGE_CONNECTION', false)
            // this.$router.push('*')
       }
  },
  render: h => h(App)
}).$mount('#app')
