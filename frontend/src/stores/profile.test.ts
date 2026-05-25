import {beforeEach, describe, expect, it, vi} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useProfileStore} from './profile'
import * as profileApi from '../api/profile'
import type {Profile} from '../types/profile'

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

describe('useProfileStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.restoreAllMocks()
    })

    it('profile starts as null', () => {
        const store = useProfileStore()
        expect(store.profile).toBeNull()
    })

    it('fetch() loads the profile from the API', async () => {
        vi.spyOn(profileApi, 'getProfile').mockResolvedValue({data: mockProfile} as any)

        const store = useProfileStore()
        await store.fetch()

        expect(store.profile).toEqual(mockProfile)
    })

    it('fetch() does not call the API again if profile is already loaded', async () => {
        const spy = vi.spyOn(profileApi, 'getProfile').mockResolvedValue({data: mockProfile} as any)

        const store = useProfileStore()
        await store.fetch()
        await store.fetch()

        expect(spy).toHaveBeenCalledTimes(1)
    })
})
