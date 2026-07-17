import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {AxiosError, type AxiosAdapter} from 'axios'
import {createPinia, setActivePinia} from 'pinia'
import client from './client'
import {useAuthStore} from '../stores/auth'
import {useFlashStore} from '../stores/flash'

const originalAdapter = client.defaults.adapter

// Echo the outgoing request headers back as the response data, so we can assert on them.
const echoAdapter: AxiosAdapter = async (config) => ({
  data: config.headers,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
})

// Reject every request with the given HTTP status, like a real server error response.
function failingAdapter(status: number): AxiosAdapter {
  return async (config) => {
    throw new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, {}, {
      data: {},
      status,
      statusText: 'Error',
      headers: {},
      config,
    })
  }
}

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
  client.defaults.adapter = echoAdapter
})

afterEach(() => {
  client.defaults.adapter = originalAdapter
})

describe('api client', () => {
  it('attaches the Bearer token when authenticated', async () => {
    useAuthStore().setToken('my.jwt.token')

    const response = await client.get('/whatever')

    expect(response.data.Authorization).toBe('Bearer my.jwt.token')
  })

  it('does not attach an Authorization header when there is no token', async () => {
    const response = await client.get('/whatever')

    expect(response.data.Authorization).toBeUndefined()
  })

  it('clears a stale token and flashes a warning on 401', async () => {
    useAuthStore().setToken('expired.jwt.token')
    client.defaults.adapter = failingAdapter(401)

    await expect(client.get('/whatever')).rejects.toThrow()

    expect(useAuthStore().token).toBeNull()
    expect(useFlashStore().message).toMatchObject({severity: 'warn', summary: 'Session expired'})
  })

  it('leaves the stores untouched on 401 without a token (e.g. bad login credentials)', async () => {
    client.defaults.adapter = failingAdapter(401)

    await expect(client.post('/auth/login', {})).rejects.toThrow()

    expect(useAuthStore().token).toBeNull()
    expect(useFlashStore().message).toBeNull()
  })

  it('keeps the token on non-401 errors', async () => {
    useAuthStore().setToken('valid.jwt.token')
    client.defaults.adapter = failingAdapter(500)

    await expect(client.get('/whatever')).rejects.toThrow()

    expect(useAuthStore().token).toBe('valid.jwt.token')
    expect(useFlashStore().message).toBeNull()
  })
})
