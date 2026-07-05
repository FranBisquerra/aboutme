import {beforeEach, describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {createRouter, createWebHistory} from 'vue-router'
import {createPinia, setActivePinia, type Pinia} from 'pinia'
import Navbar from './Navbar.vue'
import {useAuthStore} from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: {}},
        {path: '/contact', component: {}},
        {path: '/login', component: {}},
    ],
})

let pinia: Pinia

beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    pinia = createPinia()
    setActivePinia(pinia)
})

function mountNavbar() {
    return mount(Navbar, {global: {plugins: [router, pinia]}})
}

describe('Navbar', () => {
    it('renders the logo link pointing to /', () => {
        const link = mountNavbar().find('a[href="/"]')
        expect(link.exists()).toBe(true)
        expect(link.text()).toBe('franbisquerra')
    })

    it('shows the Login link pointing to /login when not authenticated', () => {
        const link = mountNavbar().find('a[href="/login"]')
        expect(link.exists()).toBe(true)
        expect(link.text()).toBe('Login')
    })

    it('hides the Login link when authenticated', () => {
        useAuthStore().setToken('a.token')
        expect(mountNavbar().find('a[href="/login"]').exists()).toBe(false)
    })

    it('shows a Logout button when authenticated', () => {
        useAuthStore().setToken('a.token')
        expect(mountNavbar().find('button[aria-label="Logout"]').exists()).toBe(true)
    })

    it('clicking Logout clears the token and reveals the Login link again', async () => {
        const auth = useAuthStore()
        auth.setToken('a.token')
        const wrapper = mountNavbar()

        await wrapper.find('button[aria-label="Logout"]').trigger('click')

        expect(auth.token).toBeNull()
        expect(wrapper.find('a[href="/login"]').exists()).toBe(true)
    })
})
