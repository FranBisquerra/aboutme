import client from './client.js'

export const getProfile = () => client.get('/profile')
