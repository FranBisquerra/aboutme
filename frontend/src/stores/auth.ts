import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

const TOKEN_KEY = 'auth.token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const isAuthenticated = computed(() => token.value !== null)

  function setToken(value: string) {
    token.value = value
    localStorage.setItem(TOKEN_KEY, value)
  }

  function clear() {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return {token, isAuthenticated, setToken, clear}
})
