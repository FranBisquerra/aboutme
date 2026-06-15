import type {LoginRequest, LoginResponse} from '../types/auth'
import client from './client'

export const login = (data: LoginRequest) => client.post<LoginResponse>('/auth/login', data)
