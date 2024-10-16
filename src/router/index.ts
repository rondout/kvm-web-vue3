/*
 * @Author: shufei.han
 * @Date: 2024-10-15 10:42:00
 * @LastEditors: shufei.han
 * @LastEditTime: 2024-10-16 10:18:52
 * @FilePath: \kvm-web-vue3\src\router\index.ts
 * @Description: 
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/layout/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomePage.vue')
        },
        {
          path: '/kvm',
          name: 'kvm',
          component: () => import('@/views/kvm/KvmPage.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})

export default router
