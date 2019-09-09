import Vue from 'vue'
import Router from 'vue-router'
import auth from './auth/authService'
import Callback from './views/Callback'
import Home from './views/Home'
import Profile from './views/Profile.vue'
import ExternalApiView from './views/ExternalApi.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/callback',
    name: 'callback',
    component: Callback,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/external-api',
    name: 'external-api',
    component: ExternalApiView,
  },
]

const router = new Router({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/callback' || auth.isAuthenticated()) {
    return next()
  }

  // Specify the current path as the customState parameter, meaning it
  // will be returned to the application after auth
  auth.login({ target: to.path })
})

export default router
