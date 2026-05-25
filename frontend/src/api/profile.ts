import type {Profile} from '../types/profile'
import client from './client'

export const getProfile = () => client.get<Profile>('/profile')
