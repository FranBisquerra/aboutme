import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import AdminHomePage from './AdminHomePage.vue'

describe('AdminHomePage', () => {
  it('renders the admin heading', () => {
    const wrapper = mount(AdminHomePage)

    expect(wrapper.text()).toContain('Admin')
  })
})
