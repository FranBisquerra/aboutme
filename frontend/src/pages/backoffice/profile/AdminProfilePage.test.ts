import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import AdminProfilePage from './AdminProfilePage.vue'
import * as profileApi from '../../../api/profile'
import {mountWithPlugins} from '../../../test/mountWithPlugins'
import type {Profile} from '../../../types/profile'

const profile: Profile = {
  name: 'Fran',
  title: 'Engineer',
  location: 'Palma',
  email: 'fran@test.dev',
  linkedin: 'https://www.linkedin.com/in/fran',
  github: 'https://github.com/fran',
  bio: 'A bio',
  languages: [],
  skills: [],
  experience: [],
  education: [],
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(profileApi, 'getProfile').mockResolvedValue({data: profile} as never)
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('AdminProfilePage', () => {
  it('prefills the form with the current profile', async () => {
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    expect((wrapper.find('#name').element as HTMLInputElement).value).toBe('Fran')
    expect((wrapper.find('#title').element as HTMLInputElement).value).toBe('Engineer')
    expect((wrapper.find('#bio').element as HTMLTextAreaElement).value).toBe('A bio')
  })

  it('submits the edited basic fields to the api', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('#title').setValue('Principal Engineer')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({
      name: 'Fran',
      title: 'Principal Engineer',
      location: 'Palma',
      email: 'fran@test.dev',
      linkedin: 'https://www.linkedin.com/in/fran',
      github: 'https://github.com/fran',
      bio: 'A bio',
    })
  })

  it('shows an error alert when the update fails', async () => {
    vi.spyOn(profileApi, 'updateProfile').mockRejectedValue(new Error('boom'))
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Could not save the profile.')
  })
})
