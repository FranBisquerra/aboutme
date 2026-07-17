import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ContactPage from '../pages/ContactPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import {useAuthStore} from '../stores/auth'
import {useFlashStore} from '../stores/flash'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: HomePage},
    {path: '/contact', component: ContactPage},
    {path: '/login', component: LoginPage},
    {path: '/admin', component: AdminPage, meta: {requiresAuth: true}},
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
    useFlashStore().notify({
      severity: 'warn',
      summary: 'Access denied',
      detail: 'You must be logged in to access the admin area.',
    })
    return {path: '/'}
  }
})

export default router
