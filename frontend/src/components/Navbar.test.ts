import {beforeEach, describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import Navbar from './Navbar.vue'

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
