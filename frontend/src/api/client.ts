import axios, {isAxiosError} from 'axios'
import {useAuthStore} from '../stores/auth'
import {useFlashStore} from '../stores/flash'

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = useAuthStore().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// An expired/invalid stored JWT makes the backend reject every request with 401 — even
// public endpoints (the resource server validates the token before permitAll applies).
// Drop the stale token so subsequent requests go out clean, and let the user know.
client.interceptors.response.use(undefined, (error) => {
  if (isAxiosError(error) && error.response?.status === 401) {
    const auth = useAuthStore()
    if (auth.token) {
      auth.clear()
      useFlashStore().notify({severity: 'warn', summary: 'Session expired', detail: 'Please log in again.'})
    }
  }
  return Promise.reject(error)
})

export default client
