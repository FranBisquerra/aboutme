import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import HomePage from './HomePage.vue'
import * as profileApi from '../../../api/profile'
import type {Profile} from '../../../types/profile'
import {mountWithPlugins} from '../../../test/mountWithPlugins'

const mockProfile: Profile = {
  name: 'Fran Bisquerra',
  title: 'Software Engineer',
  location: 'Barcelona',
  email: 'fran@example.com',
  linkedin: 'https://linkedin.com/in/fran',
  github: 'https://github.com/fran',
  bio: 'Developer',
  languages: [],
  skills: ['Java', 'Vue'],
  experience: [],
  education: [],
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('HomePage', () => {
  it('renders the profile fetched via useProfile', async () => {
    vi.spyOn(profileApi, 'getProfile').mockResolvedValue({data: mockProfile} as any)

    const wrapper = mountWithPlugins(HomePage)
    await flushPromises()

    expect(wrapper.text()).toContain('Fran Bisquerra')
  })
})
