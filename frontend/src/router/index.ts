import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ContactPage from '../pages/ContactPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import {useAuthStore} from '../stores/auth'

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
    return {path: '/login'}
  }
})

export default router
