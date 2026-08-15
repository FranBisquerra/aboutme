import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import {createPinia, type Pinia, setActivePinia} from 'pinia'
import Navbar from './Navbar.vue'
import {useAuthStore} from '../../../stores/auth'
import {mountWithPlugins} from '../../../test/mountWithPlugins'

let pinia: Pinia

beforeEach(() => {
  localStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
})

afterEach(() => {
  // The dropdown menu teleports its popup into <body>; clear it between tests.
  document.body.innerHTML = ''
})

function mountNavbar() {
  return mountWithPlugins(Navbar, {pinia})
}

async function openMenu(wrapper: ReturnType<typeof mountNavbar>) {
  const trigger = wrapper.find('button[aria-label="Account menu"]')
  await trigger.trigger('pointerdown')
  await trigger.trigger('click')
  await flushPromises()
}

function menuItem(label: string): HTMLElement | undefined {
  return [...document.body.querySelectorAll('[role="menuitem"]')]
    .find(el => el.textContent?.includes(label)) as HTMLElement | undefined
}

describe('Navbar', () => {
  it('renders the logo link pointing to /', () => {
    const link = mountNavbar().find('a[href="/"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('franbisquerra')
  })

  it('renders the account menu trigger', () => {
    expect(mountNavbar().find('button[aria-label="Account menu"]').exists()).toBe(true)
  })

  it('shows a Login item when not authenticated', async () => {
    const wrapper = mountNavbar()
    await openMenu(wrapper)

    expect(menuItem('Login')).toBeDefined()
    expect(menuItem('Admin')).toBeUndefined()
    expect(menuItem('Logout')).toBeUndefined()
  })

  it('shows only an Admin item when authenticated (logout lives in the admin sidebar)', async () => {
    useAuthStore().setToken('a.token')
    const wrapper = mountNavbar()
    await openMenu(wrapper)

    expect(menuItem('Admin')).toBeDefined()
    expect(menuItem('Logout')).toBeUndefined()
    expect(menuItem('Login')).toBeUndefined()
  })
})
