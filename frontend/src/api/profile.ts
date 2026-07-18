import type {Profile, UpdateProfileRequest} from '../types/profile'
import client from './client'

export const getProfile = () => client.get<Profile>('/profile')

export const updateProfile = (data: UpdateProfileRequest) => client.put<Profile>('/profile', data)
