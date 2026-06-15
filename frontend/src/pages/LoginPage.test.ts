import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises, mount} from '@vue/test-utils'
import {createRouter, createWebHistory} from 'vue-router'
import {createPinia, setActivePinia, type Pinia} from 'pinia'
import LoginPage from './LoginPage.vue'
import * as authApi from '../api/auth'
import {useAuthStore} from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: {}},
        {path: '/login', component: {}},
        {path: '/admin', component: {}},
    ],
})

let pinia: Pinia

beforeEach(() => {
    localStorage.clear()
    pinia = createPinia()
    setActivePinia(pinia)
    vi.restoreAllMocks()
})

function mountPage() {
    return mount(LoginPage, {global: {plugins: [router, pinia]}})
}

describe('LoginPage', () => {
    it('renders the username and password fields', () => {
        const wrapper = mountPage()

        expect(wrapper.find('#username').exists()).toBe(true)
        expect(wrapper.find('#password').exists()).toBe(true)
    })

    it('shows validation errors and does not call the api when fields are empty', async () => {
        const spy = vi.spyOn(authApi, 'login')

        const wrapper = mountPage()
        await wrapper.find('form').trigger('submit')

        expect(wrapper.text()).toContain('Username is required')
        expect(wrapper.text()).toContain('Password is required')
        expect(spy).not.toHaveBeenCalled()
    })

    it('shows the loading state while signing in', async () => {
        vi.spyOn(authApi, 'login').mockReturnValue(new Promise(() => {}))

        const wrapper = mountPage()
        await wrapper.find('#username').setValue('admin')
        await wrapper.find('#password').setValue('secret')
        await wrapper.find('form').trigger('submit')

        expect(wrapper.find('button[type="submit"]').text()).toBe('Signing in...')
        expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    })

    it('calls the api with the entered credentials', async () => {
        const spy = vi.spyOn(authApi, 'login')
            .mockResolvedValue({data: {token: 'x', tokenType: 'Bearer', expiresIn: 1}} as any)

        const wrapper = mountPage()
        await wrapper.find('#username').setValue('admin')
        await wrapper.find('#password').setValue('secret')
        await wrapper.find('form').trigger('submit')

        expect(spy).toHaveBeenCalledWith({username: 'admin', password: 'secret'})
    })

    it('stores the token and redirects to /admin on success', async () => {
        vi.spyOn(authApi, 'login')
            .mockResolvedValue({data: {token: 't.o.k', tokenType: 'Bearer', expiresIn: 3600}} as any)
        const pushSpy = vi.spyOn(router, 'push')

        const wrapper = mountPage()
        await wrapper.find('#username').setValue('admin')
        await wrapper.find('#password').setValue('secret')
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(useAuthStore().token).toBe('t.o.k')
        expect(pushSpy).toHaveBeenCalledWith('/admin')
    })

    it('shows an error and keeps no token when login fails', async () => {
        vi.spyOn(authApi, 'login').mockRejectedValue(new Error('401'))

        const wrapper = mountPage()
        await wrapper.find('#username').setValue('admin')
        await wrapper.find('#password').setValue('wrong')
        await wrapper.find('form').trigger('submit')
        await flushPromises()

        expect(wrapper.text()).toContain('Invalid username or password')
        expect(useAuthStore().token).toBeNull()
    })
})
