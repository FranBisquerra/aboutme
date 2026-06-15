import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ContactPage from '../pages/ContactPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import AdminPage from '../pages/AdminPage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: HomePage},
    {path: '/contact', component: ContactPage},
    {path: '/login', component: LoginPage},
    {path: '/admin', component: AdminPage},
  ],
})
