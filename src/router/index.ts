import { createRouter, createWebHistory } from 'vue-router'


/**
 * Router to link global views
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/annuaire',
      name: 'directory',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/charte',
      name: 'charter',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/cape',
      name: 'commission',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginBaseView.vue'),
    },
    {
      path: '/login/local',
      name: 'loginLocal',
      component: () => import('@/views/LoginLocalView.vue'),
    }
  ]
})

export default router
