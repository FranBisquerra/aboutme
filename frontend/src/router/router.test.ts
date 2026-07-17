import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import router from './index'
import HomePage from '../pages/HomePage.vue'
import ContactPage from '../pages/ContactPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import {useAuthStore} from '../stores/auth'
import {useFlashStore} from '../stores/flash'

function resolvedComponent() {
  return router.currentRoute.value.matched[0]?.components?.default
}

describe('Router', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('/ resolves to HomePage', async () => {
    await router.push('/')
    expect(resolvedComponent()).toBe(HomePage)
  })

  it('/contact resolves to ContactPage', async () => {
    await router.push('/contact')
    expect(resolvedComponent()).toBe(ContactPage)
  })

  it('/login resolves to LoginPage', async () => {
    await router.push('/login')
    expect(resolvedComponent()).toBe(LoginPage)
  })

  it('redirects /admin to / with a warn flash when not authenticated', async () => {
    await router.push('/admin')
    expect(router.currentRoute.value.path).toBe('/')
    expect(useFlashStore().message).toMatchObject({severity: 'warn', summary: 'Access denied'})
  })

  it('allows /admin when authenticated', async () => {
    useAuthStore().setToken('a.token')
    await router.push('/admin')
    expect(resolvedComponent()).toBe(AdminPage)
  })
})
