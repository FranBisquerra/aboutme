import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import ContactPage from './ContactPage.vue'
import * as contactApi from '../api/contact'
import {mountWithPlugins} from '../test/mountWithPlugins'

beforeEach(() => {
    vi.restoreAllMocks()
})

async function fillValidForm(wrapper: ReturnType<typeof mountWithPlugins>) {
    await wrapper.find('#name').setValue('John Doe')
    await wrapper.find('#email').setValue('john@example.com')
    await wrapper.find('#message').setValue('Hello!')
}

describe('ContactPage', () => {
    it('renders the form fields', () => {
        const wrapper = mountWithPlugins(ContactPage)

        expect(wrapper.find('#name').exists()).toBe(true)
        expect(wrapper.find('#email').exists()).toBe(true)
        expect(wrapper.find('#message').exists()).toBe(true)
    })

    it('does not call the api and shows a validation message when empty', async () => {
        const spy = vi.spyOn(contactApi, 'sendContactMessage')

        const wrapper = mountWithPlugins(ContactPage)
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(spy).not.toHaveBeenCalled()
        expect(wrapper.text()).toContain('Name is required')
    })

    it('calls the api with the form data', async () => {
        const spy = vi.spyOn(contactApi, 'sendContactMessage').mockResolvedValue({} as any)

        const wrapper = mountWithPlugins(ContactPage)
        await fillValidForm(wrapper)
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(spy).toHaveBeenCalledWith({name: 'John Doe', email: 'john@example.com', message: 'Hello!'})
    })

    it('shows the success state and hides the form after a successful submit', async () => {
        vi.spyOn(contactApi, 'sendContactMessage').mockResolvedValue({} as any)

        const wrapper = mountWithPlugins(ContactPage)
        await fillValidForm(wrapper)
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.find('form').exists()).toBe(false)
        expect(wrapper.text()).toContain('Message sent!')
    })

    it('shows an error message after a failed submit', async () => {
        vi.spyOn(contactApi, 'sendContactMessage').mockRejectedValue(new Error('fail'))

        const wrapper = mountWithPlugins(ContactPage)
        await fillValidForm(wrapper)
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.find('form').exists()).toBe(true)
        expect(wrapper.text()).toContain('Something went wrong')
    })
})
