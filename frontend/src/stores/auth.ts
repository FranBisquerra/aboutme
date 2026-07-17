import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

const TOKEN_KEY = 'auth.token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const isAuthenticated = computed(() => token.value !== null)

  // Username from the JWT `sub` claim (display only — the backend validates the token).
  const username = computed(() => {
    if (!token.value) {
      return null
    }
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      return typeof payload.sub === 'string' ? payload.sub : null
    } catch {
      return null
    }
  })

  function setToken(value: string) {
    token.value = value
    localStorage.setItem(TOKEN_KEY, value)
  }

  function clear() {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return {token, isAuthenticated, username, setToken, clear}
})
