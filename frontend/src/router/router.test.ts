import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import router from './index'
import HomePage from '../pages/front/home/HomePage.vue'
import ContactPage from '../pages/front/contact/ContactPage.vue'
import LoginPage from '../pages/front/login/LoginPage.vue'
import AdminHomePage from '../pages/backoffice/home/AdminHomePage.vue'
import AdminProfilePage from '../pages/backoffice/profile/AdminProfilePage.vue'
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
    expect(resolvedComponent()).toBe(AdminHomePage)
  })

  it('allows /admin/profile when authenticated', async () => {
    useAuthStore().setToken('a.token')
    await router.push('/admin/profile')
    expect(resolvedComponent()).toBe(AdminProfilePage)
  })

  it('redirects /admin to / and clears an expired token with a session-expired flash', async () => {
    const exp = Math.floor(Date.now() / 1000) - 1
    const payload = btoa(JSON.stringify({sub: 'admin', exp}))
    const auth = useAuthStore()
    auth.setToken(`header.${payload}.signature`)

    await router.push('/admin')

    expect(router.currentRoute.value.path).toBe('/')
    expect(auth.token).toBeNull()
    expect(useFlashStore().message).toMatchObject({severity: 'warn', summary: 'Session expired'})
  })

  it('redirects /admin/profile to / with a warn flash when not authenticated', async () => {
    await router.push('/') // move away first: pushing the current route skips the guard
    await router.push('/admin/profile')
    expect(router.currentRoute.value.path).toBe('/')
    expect(useFlashStore().message).toMatchObject({severity: 'warn', summary: 'Access denied'})
  })
})
