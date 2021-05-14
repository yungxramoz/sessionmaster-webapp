import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import AuthModule from '@/store/modules/auth-module'
import store from '@/store'
import { getModule } from 'vuex-module-decorators'

import Home from '@/views/pages/Home'
import Signup from '@/views/pages/Signup'
import Login from '@/views/pages/Login'
import NotFound from '@/views/pages/NotFound'

let auth: AuthModule = getModule(AuthModule, store)

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    meta: {
      guest: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/pages/Profile'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/collection',
    name: 'Collection',
    component: () => import('../views/pages/Collection'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/sessionplan',
    component: () => import('../views/pages/Sessionplan'),
    children: [
      {
        path: 'wizard',
        name: 'SessionplaWizard',
        component: () => import('../views/pages/Sessionplan/Wizard.vue'),
      },
      {
        path: 'manager',
        name: 'SessionplaManager',
        component: () => import('../views/pages/Sessionplan/Manager.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'details/:id',
        name: 'SessionplaDetails',
        component: () => import('../views/pages/Sessionplan/Details.vue'),
      },
    ],
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(_to, _from, _savedPosition) {
    return { x: 0, y: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (auth.isLoggedIn) {
      next()
    } else {
      next('/login')
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (!auth.isLoggedIn) {
      next()
    } else {
      next('/collection')
    }
  } else {
    next()
  }
})

export default router
