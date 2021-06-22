import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard'),
  },
  {
    path: '/buildings',
    name: 'buildings',
    component: () => import('@/views/buildings'),
  },
  {
    path: '/floors',
    name: 'floors',
    component: () => import('@/views/floors'),
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: () => import('@/views/rooms'),
  },
  {
    path: '/beds',
    name: 'beds',
    component: () => import('@/views/beds'),
  },
  {
    path: '/vacancies',
    name: 'vacancies',
    component: () => import('@/views/vacancies'),
  },
  {
    path: '/tenants',
    name: 'tenants',
    component: () => import('@/views/tenants'),
  },
  {
    path: '/consumptions',
    name: 'consumptions',
    component: () => import('@/views/consumptions'),
  },
  {
    path: '/rentals',
    name: 'rentals',
    component: () => import('@/views/rentals'),
  },
  {
    path: '/dormpass',
    name: 'dormpass',
    component: () => import('@/views/dormpass'),
  },
  {
    path: '/dormpassedit',
    name: 'dormpassedit',
    component: () => import('@/components/dormpassedit'),
    props: true
  },
  {
    path: '/assignroom',
    name: 'assignroom',
    component: () => import('@/components/assignroom'),
  },
  {
    path: '/tenantedit',
    name: 'tenantedit',
    component: () => import('@/components/tenantedit'),
  },
  {
    path: '*',
    name: 'error',
    component: () => import('@/views/error'),
  },
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
