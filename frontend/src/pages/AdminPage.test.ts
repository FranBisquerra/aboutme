import {beforeEach, describe, expect, it} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import {createPinia, type Pinia, setActivePinia} from 'pinia'
import AdminPage from './AdminPage.vue'
import {useAuthStore} from '../stores/auth'
import {useSidebarStore} from '../stores/sidebar'
import {mountWithPlugins} from '../test/mountWithPlugins'

let pinia: Pinia

beforeEach(() => {
  localStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
})

describe('AdminPage', () => {
  it('renders the sidebar with the username, the Profile section and Logout', () => {
    const payload = btoa(JSON.stringify({sub: 'admin'}))
    useAuthStore().setToken(`header.${payload}.signature`)

    const wrapper = mountWithPlugins(AdminPage, {pinia})

    const sidebar = wrapper.find('aside')
    expect(sidebar.text()).toContain('admin')
    expect(sidebar.text()).toContain('Profile')
    expect(sidebar.text()).toContain('Logout')
  })

  it('collapses to icons only, keeping the links', async () => {
    useSidebarStore().toggle()
    const wrapper = mountWithPlugins(AdminPage, {pinia})

    const sidebar = wrapper.find('aside')
    expect(sidebar.text()).not.toContain('Profile')
    expect(sidebar.text()).not.toContain('Logout')
    expect(sidebar.find('a[aria-label="Profile"] i.pi-user').exists()).toBe(true)
    expect(sidebar.find('button[aria-label="Logout"] i.pi-sign-out').exists()).toBe(true)
  })

  it('logout from the sidebar clears the token', async () => {
    const auth = useAuthStore()
    auth.setToken('a.token')
    const wrapper = mountWithPlugins(AdminPage, {pinia})

    await wrapper.find('button[aria-label="Logout"]').trigger('click')
    await flushPromises()

    expect(auth.token).toBeNull()
  })
})
