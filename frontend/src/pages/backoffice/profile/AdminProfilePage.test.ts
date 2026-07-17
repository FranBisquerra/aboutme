import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import AdminProfilePage from './AdminProfilePage.vue'

describe('AdminProfilePage', () => {
  it('renders the profile heading', () => {
    const wrapper = mount(AdminProfilePage)

    expect(wrapper.text()).toContain('Profile')
  })
})
