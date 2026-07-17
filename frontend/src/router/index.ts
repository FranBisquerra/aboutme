import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../pages/front/home/HomePage.vue'
import ContactPage from '../pages/front/contact/ContactPage.vue'
import LoginPage from '../pages/front/login/LoginPage.vue'
import AdminHomePage from '../pages/backoffice/home/AdminHomePage.vue'
import AdminProfilePage from '../pages/backoffice/profile/AdminProfilePage.vue'
import {useAuthStore} from '../stores/auth'
import {useFlashStore} from '../stores/flash'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: HomePage},
    {path: '/contact', component: ContactPage},
    {path: '/login', component: LoginPage},
    {path: '/admin', component: AdminHomePage, meta: {requiresAuth: true, layout: 'admin'}},
    {path: '/admin/profile', component: AdminProfilePage, meta: {requiresAuth: true, layout: 'admin'}},
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
