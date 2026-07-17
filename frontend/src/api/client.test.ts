import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import type {AxiosAdapter} from 'axios'
import {createPinia, setActivePinia} from 'pinia'
import client from './client'
import {useAuthStore} from '../stores/auth'

const originalAdapter = client.defaults.adapter

// Echo the outgoing request headers back as the response data, so we can assert on them.
const echoAdapter: AxiosAdapter = async (config) => ({
  data: config.headers,
  status: 200,
  statusText: 'OK',
  headers: {},
  config,
})

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
})
