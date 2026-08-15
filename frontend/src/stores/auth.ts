import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

const TOKEN_KEY = 'auth.token'

function decodePayload(token: string): Record<string, unknown> | null {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const payload = computed(() => (token.value ? decodePayload(token.value) : null))

  // Expired only when we can read a numeric `exp` (seconds since epoch) that is in the past.
  // A missing/undecodable exp is treated as non-expired — the backend is the real gate.
  const isExpired = computed(() => {
    const exp = payload.value?.exp
    return typeof exp === 'number' && exp * 1000 <= Date.now()
  })

  const isAuthenticated = computed(() => token.value !== null && !isExpired.value)

  const username = computed(() => {
    const sub = payload.value?.sub
    return typeof sub === 'string' ? sub : null
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
