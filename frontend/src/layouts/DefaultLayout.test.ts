import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import DefaultLayout from './DefaultLayout.vue'
import {mountWithPlugins} from '../test/mountWithPlugins'

describe('DefaultLayout', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('wraps the slotted content between the public navbar and footer', () => {
    const wrapper = mountWithPlugins(DefaultLayout, {slots: {default: '<main>page body</main>'}})

    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.text()).toContain('page body')
  })
})
