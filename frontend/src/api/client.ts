import axios from 'axios'
import {useAuthStore} from '../stores/auth'

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the JWT (when present) to every request so protected endpoints receive it.
client.interceptors.request.use((config) => {
  const token = useAuthStore().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
