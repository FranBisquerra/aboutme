import {beforeEach, describe, expect, it} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import {createPinia, type Pinia, setActivePinia} from 'pinia'
import AdminLayout from './AdminLayout.vue'
import {useAuthStore} from '../stores/auth'
import {mountWithPlugins} from '../test/mountWithPlugins'

let pinia: Pinia

beforeEach(() => {
  localStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
})

describe('AdminLayout', () => {
  it('renders the sidebar with the username, the Profile link and Logout', () => {
    const payload = btoa(JSON.stringify({sub: 'admin'}))
    useAuthStore().setToken(`header.${payload}.signature`)

    const wrapper = mountWithPlugins(AdminLayout, {pinia})

    expect(wrapper.text()).toContain('admin')
    expect(wrapper.find('a[href="/admin/profile"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Logout"]').exists()).toBe(true)
  })

  it('renders the slotted section body in the panel', () => {
    useAuthStore().setToken('a.token')

    const wrapper = mountWithPlugins(AdminLayout, {pinia, slots: {default: '<section>section body</section>'}})

    expect(wrapper.text()).toContain('section body')
  })

  it('logout from the sidebar clears the token', async () => {
    const auth = useAuthStore()
    auth.setToken('a.token')
    const wrapper = mountWithPlugins(AdminLayout, {pinia})

    await wrapper.find('button[aria-label="Logout"]').trigger('click')
    await flushPromises()

    expect(auth.token).toBeNull()
  })
})
