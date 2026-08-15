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
  experience: [
    {company: 'Older Co', role: 'Dev', start: '2018-04', end: '2020-01', description: 'Older job'},
    {company: 'Newer Co', role: 'Lead', start: '2021-06', end: null, description: 'Newer job'},
  ],
  education: [
    {institution: 'First Uni', degree: 'Older degree', start: '2008', end: '2012'},
    {institution: 'Second Uni', degree: 'Newer degree', start: '2014', end: '2016'},
  ],
  courses: [
    {institution: 'Udemy', name: 'Older course', start: '2017', end: null},
    {institution: 'Coursera', name: 'Newer course', start: '2022', end: '2023'},
  ],
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

  it('renders experience, education and courses most recent first', async () => {
    vi.spyOn(profileApi, 'getProfile').mockResolvedValue({data: mockProfile} as any)

    const wrapper = mountWithPlugins(HomePage)
    await flushPromises()

    const text = wrapper.text()
    expect(text.indexOf('Newer Co')).toBeLessThan(text.indexOf('Older Co'))
    expect(text.indexOf('Newer degree')).toBeLessThan(text.indexOf('Older degree'))
    expect(text.indexOf('Newer course')).toBeLessThan(text.indexOf('Older course'))
  })

  it('shows only the start year for a course with no end year', async () => {
    vi.spyOn(profileApi, 'getProfile').mockResolvedValue({data: mockProfile} as any)

    const wrapper = mountWithPlugins(HomePage)
    await flushPromises()

    expect(wrapper.text()).toContain('2022 – 2023')
    expect(wrapper.text()).not.toContain('2017 –')
  })
})
