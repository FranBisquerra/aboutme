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

  it('initializes the token from localStorage', () => {
    localStorage.setItem('auth.token', 'persisted')
    setActivePinia(createPinia())

    const store = useAuthStore()
    expect(store.token).toBe('persisted')
  })
})
