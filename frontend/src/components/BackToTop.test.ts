import {describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import BackToTop from './BackToTop.vue'

describe('BackToTop', () => {
  it('is hidden on initial render', () => {
    const wrapper = mount(BackToTop)
    expect(wrapper.find('button').classes()).toContain('opacity-0')
  })

  it('becomes visible after scrolling more than 300px', async () => {
    const wrapper = mount(BackToTop)

    Object.defineProperty(window, 'scrollY', {value: 400, writable: true})
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('button').classes()).toContain('opacity-100')
  })

  it('hides again when scrolling back to the top', async () => {
    const wrapper = mount(BackToTop)

    Object.defineProperty(window, 'scrollY', {value: 400, writable: true})
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    Object.defineProperty(window, 'scrollY', {value: 0, writable: true})
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('button').classes()).toContain('opacity-0')
  })

  it('calls window.scrollTo when the button is clicked', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {
    })
    const wrapper = mount(BackToTop)

    await wrapper.find('button').trigger('click')

    expect(scrollTo).toHaveBeenCalledWith({top: 0, behavior: 'smooth'})
    scrollTo.mockRestore()
  })
})
