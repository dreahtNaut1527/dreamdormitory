import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
    if(to.path !== '/' && !store.state.isLoggedIn) {
      next('/') // Goto Login page
    } else if(to.path === '/' && store.state.isLoggedIn) {
      // check if network is connected
      if(store.state.isConnect) {
          next('/dashboard') // When login success , goto dashboard
      } else {
        next('*')
      }
    } else {
      next()
    }
})

export default router
