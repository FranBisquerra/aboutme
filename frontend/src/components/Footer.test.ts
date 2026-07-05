import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import Footer from './Footer.vue'
import * as profileApi from '../api/profile'
import type {Profile} from '../types/profile'
import {mountWithPlugins} from '../test/mountWithPlugins'

const mockProfile: Profile = {
    name: 'Fran Bisquerra',
    title: 'Software Engineer',
    location: 'Barcelona',
    email: 'fran@example.com',
    linkedin: 'https://linkedin.com/in/fran',
    github: 'https://github.com/fran',
    bio: 'Developer',
    languages: [],
    skills: [],
    experience: [],
    education: [],
}

beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
    // Footer calls useProfile() on mount; stub it so no test hits the network.
    vi.spyOn(profileApi, 'getProfile').mockResolvedValue({data: mockProfile} as any)
})

describe('Footer', () => {
    it('renders the copyright line with the current year', () => {
        const wrapper = mountWithPlugins(Footer)

        expect(wrapper.text()).toContain(`© ${new Date().getFullYear()} Fran Bisquerra`)
    })

    it('renders the social links from the profile', async () => {
        const wrapper = mountWithPlugins(Footer)
        await flushPromises()

        expect(wrapper.find(`a[href="${mockProfile.github}"]`).exists()).toBe(true)
        expect(wrapper.find(`a[href="${mockProfile.linkedin}"]`).exists()).toBe(true)
    })
})

describe('Footer dark mode', () => {
    it('renders the toggle button', () => {
        expect(mountWithPlugins(Footer).find('button[aria-label="Toggle dark mode"]').exists()).toBe(true)
    })

    it('clicking the toggle button flips the dark class on <html>', async () => {
        localStorage.setItem('theme', 'light')
        const wrapper = mountWithPlugins(Footer)
        const before = document.documentElement.classList.contains('dark')

        await wrapper.find('button[aria-label="Toggle dark mode"]').trigger('click')

        expect(document.documentElement.classList.contains('dark')).toBe(!before)
    })

    it('persists the chosen theme to localStorage after toggle', async () => {
        localStorage.setItem('theme', 'light')
        const wrapper = mountWithPlugins(Footer)

        await wrapper.find('button[aria-label="Toggle dark mode"]').trigger('click')

        expect(localStorage.getItem('theme')).toMatch(/^(dark|light)$/)
    })

    it('reads dark preference from localStorage on mount', () => {
        localStorage.setItem('theme', 'dark')
        mountWithPlugins(Footer)
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('reads light preference from localStorage on mount', () => {
        localStorage.setItem('theme', 'light')
        mountWithPlugins(Footer)
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
})
