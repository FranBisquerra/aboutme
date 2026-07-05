import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import AdminPage from './AdminPage.vue'

describe('AdminPage', () => {
  it('renders the admin heading', () => {
    const wrapper = mount(AdminPage)

    expect(wrapper.text()).toContain('Admin')
  })
})
