import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSidebarStore} from './sidebar'

describe('useSidebarStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts expanded', () => {
    expect(useSidebarStore().collapsed).toBe(false)
  })

  it('toggle flips the collapsed state', () => {
    const store = useSidebarStore()
    store.toggle()
    expect(store.collapsed).toBe(true)
    store.toggle()
    expect(store.collapsed).toBe(false)
  })
})
