import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import {createPinia, type Pinia, setActivePinia} from 'pinia'
import type {Router} from 'vue-router'
import LoginPage from './LoginPage.vue'
import * as authApi from '../../../api/auth'
import {useAuthStore} from '../../../stores/auth'
import {createTestRouter, mountWithPlugins} from '../../../test/mountWithPlugins'

let router: Router
let pinia: Pinia

beforeEach(() => {
  localStorage.clear()
  router = createTestRouter()
  pinia = createPinia()
  setActivePinia(pinia)
  vi.restoreAllMocks()
})

function mountPage() {
  return mountWithPlugins(LoginPage, {router, pinia})
}

const loginResponse = {data: {token: 't.o.k', tokenType: 'Bearer', expiresIn: 3600}} as any

describe('LoginPage', () => {
  it('renders the username and password fields', () => {
    const wrapper = mountPage()

    expect(wrapper.find('#username').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('shows the loading state while signing in', async () => {
    vi.spyOn(authApi, 'login').mockReturnValue(new Promise(() => {
    }))

    const wrapper = mountPage()
    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('does not call the api when the form is empty', async () => {
    const spy = vi.spyOn(authApi, 'login')

    const wrapper = mountPage()
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(spy).not.toHaveBeenCalled()
  })

  it('shows a validation message when a field is empty', async () => {
    const wrapper = mountPage()
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Username is required')
  })

  it('calls the api with the entered credentials', async () => {
    const spy = vi.spyOn(authApi, 'login').mockResolvedValue(loginResponse)

    const wrapper = mountPage()
    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({username: 'admin', password: 'secret'})
  })

  it('stores the token and redirects to the home on success', async () => {
    vi.spyOn(authApi, 'login').mockResolvedValue(loginResponse)
    const pushSpy = vi.spyOn(router, 'push')

    const wrapper = mountPage()
    await wrapper.find('#username').setValue('admin')
    await wrapper.find('#password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(useAuthStore().token).toBe('t.o.k')
    expect(pushSpy).toHaveBeenCalledWith('/')
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
