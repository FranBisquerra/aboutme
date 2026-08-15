import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import AdminProfilePage from './AdminProfilePage.vue'
import * as profileApi from '../../../api/profile'
import {mountWithPlugins} from '../../../test/mountWithPlugins'
import type {EducationEntry, ExperienceEntry, Profile} from '../../../types/profile'

const acme: ExperienceEntry = {
  company: 'Acme',
  role: 'Senior Dev',
  start: '2022-01',
  end: null,
  description: 'Built things',
}

const uib: EducationEntry = {
  institution: 'UIB',
  degree: 'Computer Engineering',
  start: '2012',
  end: '2019',
}

const profile: Profile = {
  name: 'Fran',
  title: 'Engineer',
  location: 'Palma',
  email: 'fran@test.dev',
  linkedin: 'https://www.linkedin.com/in/fran',
  github: 'https://github.com/fran',
  bio: 'A bio',
  languages: [{name: 'Catalan', level: 'Native'}],
  skills: ['Java'],
  experience: [acme],
  education: [uib],
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(profileApi, 'getProfile').mockResolvedValue({data: profile} as never)
})

afterEach(() => {
  document.body.innerHTML = ''
})

function setInput(id: string, value: string) {
  const el = document.getElementById(id) as HTMLInputElement
  el.value = value
  el.dispatchEvent(new Event('input', {bubbles: true}))
}

function bodyButton(text: string): HTMLButtonElement | undefined {
  return [...document.body.querySelectorAll('button')].find(b => b.textContent?.trim() === text) as HTMLButtonElement | undefined
}

describe('AdminProfilePage', () => {
  it('prefills the form with the current profile', async () => {
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    expect((wrapper.find('#name').element as HTMLInputElement).value).toBe('Fran')
    expect((wrapper.find('#title').element as HTMLInputElement).value).toBe('Engineer')
    expect((wrapper.find('#bio').element as HTMLTextAreaElement).value).toBe('A bio')
  })

  it('submits the whole document when the basic fields change', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('#title').setValue('Principal Engineer')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({...profile, title: 'Principal Engineer'})
  })

  it('shows an error alert when the update fails', async () => {
    vi.spyOn(profileApi, 'updateProfile').mockRejectedValue(new Error('boom'))
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Could not save the profile.')
  })

  it('lists the experience entries', async () => {
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    expect(wrapper.text()).toContain('Senior Dev')
    expect(wrapper.text()).toContain('Acme')
  })

  it('appends a new experience to the document', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    const addButton = wrapper.findAll('button').find(b => b.text().includes('Add experience'))!
    await addButton.trigger('click')
    await flushPromises()

    setInput('exp-company', 'Globex')
    setInput('exp-role', 'Engineer')
    setInput('exp-start', '2020-01')
    setInput('exp-description', 'Did things')
    await flushPromises()

    bodyButton('Save')!.click()
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({
      ...profile,
      experience: [
        acme,
        {company: 'Globex', role: 'Engineer', start: '2020-01', end: null, description: 'Did things'},
      ],
    })
  })

  it('replaces the edited experience in the document', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('button[aria-label="Edit Acme"]').trigger('click')
    await flushPromises()

    setInput('exp-role', 'Staff Dev')
    await flushPromises()

    bodyButton('Save')!.click()
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({...profile, experience: [{...acme, role: 'Staff Dev'}]})
  })

  it('drops the deleted experience from the document after confirmation', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('button[aria-label="Delete Acme"]').trigger('click')
    await flushPromises()

    bodyButton('Delete')!.click()
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({...profile, experience: []})
  })

  it('lists the education entries', async () => {
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    expect(wrapper.text()).toContain('Computer Engineering')
    expect(wrapper.text()).toContain('UIB')
  })

  it('appends a new education to the document', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    const addButton = wrapper.findAll('button').find(b => b.text().includes('Add education'))!
    await addButton.trigger('click')
    await flushPromises()

    setInput('edu-institution', 'MIT')
    setInput('edu-degree', 'Physics')
    setInput('edu-start', '2005')
    setInput('edu-end', '2009')
    await flushPromises()

    bodyButton('Save')!.click()
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({
      ...profile,
      education: [
        uib,
        {institution: 'MIT', degree: 'Physics', start: '2005', end: '2009'},
      ],
    })
  })

  it('replaces the edited education in the document', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('button[aria-label="Edit Computer Engineering"]').trigger('click')
    await flushPromises()

    setInput('edu-end', '2020')
    await flushPromises()

    bodyButton('Save')!.click()
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({...profile, education: [{...uib, end: '2020'}]})
  })

  it('drops the deleted education from the document after confirmation', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('button[aria-label="Delete Computer Engineering"]').trigger('click')
    await flushPromises()

    bodyButton('Delete')!.click()
    await flushPromises()

    expect(spy).toHaveBeenCalledWith({...profile, education: []})
  })

  it('rejects an education year that is not four digits', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('button[aria-label="Edit Computer Engineering"]').trigger('click')
    await flushPromises()

    setInput('edu-end', '20')
    await flushPromises()

    bodyButton('Save')!.click()
    await flushPromises()

    expect(spy).not.toHaveBeenCalled()
    expect(document.body.textContent).toContain('Use the YYYY format')
  })

  it('editing an experience does not touch the education list', async () => {
    const spy = vi.spyOn(profileApi, 'updateProfile').mockResolvedValue({data: profile} as never)
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('button[aria-label="Edit Acme"]').trigger('click')
    await flushPromises()

    setInput('exp-role', 'Staff Dev')
    await flushPromises()

    bodyButton('Save')!.click()
    await flushPromises()

    expect(spy.mock.calls[0][0].education).toEqual([uib])
  })

  it('shows an error alert when deleting an experience fails', async () => {
    vi.spyOn(profileApi, 'updateProfile').mockRejectedValue(new Error('boom'))
    const wrapper = mountWithPlugins(AdminProfilePage)
    await flushPromises()

    await wrapper.find('button[aria-label="Delete Acme"]').trigger('click')
    await flushPromises()

    bodyButton('Delete')!.click()
    await flushPromises()

    expect(document.body.textContent).toContain('Could not save the experience.')
  })
})
