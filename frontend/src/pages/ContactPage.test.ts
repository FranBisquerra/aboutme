import {beforeEach, describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {createRouter, createWebHistory} from 'vue-router'
import ContactPage from './ContactPage.vue'
import * as contactApi from '../api/contact'

const router = createRouter({
    history: createWebHistory(),
    routes: [{path: '/', component: {}}, {path: '/contact', component: {}}],
})

describe('ContactPage', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it('renders the form fields', () => {
        const wrapper = mount(ContactPage, {global: {plugins: [router]}})

        expect(wrapper.find('#name').exists()).toBe(true)
        expect(wrapper.find('#email').exists()).toBe(true)
        expect(wrapper.find('#message').exists()).toBe(true)
    })

    it('renders the submit button', () => {
        const wrapper = mount(ContactPage, {global: {plugins: [router]}})

        expect(wrapper.find('button[type="submit"]').text()).toBe('Send message')
    })

    it('renders the heading and subtitle before submission', () => {
        const wrapper = mount(ContactPage, {global: {plugins: [router]}})

        expect(wrapper.text()).toContain('Contact me')
        expect(wrapper.text()).toContain("Send me a message")
    })

    it('shows loading state while submitting', async () => {
        vi.spyOn(contactApi, 'sendContactMessage').mockReturnValue(new Promise(() => {}))

        const wrapper = mount(ContactPage, {global: {plugins: [router]}})
        await wrapper.find('form').trigger('submit')

        expect(wrapper.find('button[type="submit"]').text()).toBe('Sending...')
        expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    })

    it('shows success message and hides heading after successful submission', async () => {
        vi.spyOn(contactApi, 'sendContactMessage').mockResolvedValue({} as any)

        const wrapper = mount(ContactPage, {global: {plugins: [router]}})
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('form').exists()).toBe(false)
        expect(wrapper.text()).toContain('Message sent!')
        expect(wrapper.text()).not.toContain('Contact me')
    })

    it('shows back to home link after successful submission', async () => {
        vi.spyOn(contactApi, 'sendContactMessage').mockResolvedValue({} as any)

        const wrapper = mount(ContactPage, {global: {plugins: [router]}})
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('a[href="/"]').exists()).toBe(true)
        expect(wrapper.find('a[href="/"]').text()).toContain('Back to home')
    })

    it('shows error message after failed submission', async () => {
        vi.spyOn(contactApi, 'sendContactMessage').mockRejectedValue(new Error('Network error'))

        const wrapper = mount(ContactPage, {global: {plugins: [router]}})
        await wrapper.find('form').trigger('submit')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('form').exists()).toBe(true)
        expect(wrapper.text()).toContain('Something went wrong')
    })

    it('calls the API with form data on submit', async () => {
        const spy = vi.spyOn(contactApi, 'sendContactMessage').mockResolvedValue({} as any)

        const wrapper = mount(ContactPage, {global: {plugins: [router]}})
        await wrapper.find('#name').setValue('John Doe')
        await wrapper.find('#email').setValue('john@example.com')
        await wrapper.find('#message').setValue('Hello!')
        await wrapper.find('form').trigger('submit')

        expect(spy).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'Hello!',
        })
    })
})
