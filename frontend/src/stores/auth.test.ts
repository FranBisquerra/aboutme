import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useAuthStore} from './auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('token starts as null when nothing is stored', () => {
    const store = useAuthStore()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('setToken stores the token and marks as authenticated', () => {
    const store = useAuthStore()
    store.setToken('abc.def.ghi')

    expect(store.token).toBe('abc.def.ghi')
    expect(store.isAuthenticated).toBe(true)
    expect(localStorage.getItem('auth.token')).toBe('abc.def.ghi')
  })

  it('clear removes the token', () => {
    const store = useAuthStore()
    store.setToken('abc')
    store.clear()

    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth.token')).toBeNull()
  })

  it('exposes the username from the JWT sub claim', () => {
    const payload = btoa(JSON.stringify({sub: 'admin', role: 'ADMIN'}))
    const store = useAuthStore()
    store.setToken(`header.${payload}.signature`)

    expect(store.username).toBe('admin')
  })

  it('username is null without token or with a malformed one', () => {
    const store = useAuthStore()
    expect(store.username).toBeNull()

    store.setToken('not-a-jwt')
    expect(store.username).toBeNull()
  })

  it('is authenticated with a token whose exp is in the future', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600
    const payload = btoa(JSON.stringify({sub: 'admin', exp}))
    const store = useAuthStore()
    store.setToken(`header.${payload}.signature`)

    expect(store.isAuthenticated).toBe(true)
  })

  it('is not authenticated with a token whose exp is in the past', () => {
    const exp = Math.floor(Date.now() / 1000) - 1
    const payload = btoa(JSON.stringify({sub: 'admin', exp}))
    const store = useAuthStore()
    store.setToken(`header.${payload}.signature`)

    expect(store.token).not.toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('initializes the token from localStorage', () => {
    localStorage.setItem('auth.token', 'persisted')
    setActivePinia(createPinia())

    const store = useAuthStore()
    expect(store.token).toBe('persisted')
  })
})
