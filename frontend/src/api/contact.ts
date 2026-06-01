import type {ContactRequest} from '../types/contact'
import client from './client'

export const sendContactMessage = (data: ContactRequest) => client.post('/contact', data)
