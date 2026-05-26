import {beforeEach, describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {createRouter, createWebHistory} from 'vue-router'
import Navbar from './Navbar.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [{path: '/', component: {}}, {path: '/contact', component: {}}],
})

describe('Navbar', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.classList.remove('dark')
    })

    it('renders the logo link pointing to /', () => {
        const wrapper = mount(Navbar, {global: {plugins: [router]}})
        const link = wrapper.find('a[href="/"]')
        expect(link.exists()).toBe(true)
        expect(link.text()).toBe('franbisquerra')
    })

    it('renders the Contact me! link pointing to /contact', () => {
        const wrapper = mount(Navbar, {global: {plugins: [router]}})
        const link = wrapper.find('a[href="/contact"]')
        expect(link.exists()).toBe(true)
        expect(link.text()).toBe('Contact me!')
    })
})

describe('Navbar dark mode', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.classList.remove('dark')
    })

    it('renders the toggle button', () => {
        const wrapper = mount(Navbar)
        expect(wrapper.find('button[aria-label="Toggle dark mode"]').exists()).toBe(true)
    })

    it('clicking the toggle button flips the dark class on <html>', async () => {
        localStorage.setItem('theme', 'light')
        const wrapper = mount(Navbar)
        const before = document.documentElement.classList.contains('dark')

        await wrapper.find('button[aria-label="Toggle dark mode"]').trigger('click')

        expect(document.documentElement.classList.contains('dark')).toBe(!before)
    })

    it('persists the chosen theme to localStorage after toggle', async () => {
        localStorage.setItem('theme', 'light')
        const wrapper = mount(Navbar)

        await wrapper.find('button[aria-label="Toggle dark mode"]').trigger('click')

        expect(localStorage.getItem('theme')).toMatch(/^(dark|light)$/)
    })

    it('reads dark preference from localStorage on mount', () => {
        localStorage.setItem('theme', 'dark')
        mount(Navbar)
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('reads light preference from localStorage on mount', () => {
        localStorage.setItem('theme', 'light')
        mount(Navbar)
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
})
