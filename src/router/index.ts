import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DownloadView from '@/views/DownloadView.vue'
import LoginView from '@/views/Authentication/LoginView.vue'
import PricingView from '@/views/PricingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/download',
      name: 'download',
      component: DownloadView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: PricingView,
    },
  ],
})

export default router
