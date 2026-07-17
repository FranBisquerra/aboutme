import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useFlashStore} from './flash'

describe('useFlashStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with no message', () => {
    expect(useFlashStore().message).toBeNull()
  })

  it('notify sets the message', () => {
    const store = useFlashStore()
    store.notify({severity: 'warn', summary: 'Access denied', detail: 'Nope'})

    expect(store.message).toEqual({severity: 'warn', summary: 'Access denied', detail: 'Nope'})
  })

  it('clear resets the message', () => {
    const store = useFlashStore()
    store.notify({severity: 'info', summary: 'Hi'})
    store.clear()

    expect(store.message).toBeNull()
  })
})
