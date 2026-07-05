import {useQuery} from '@tanstack/vue-query'
import {getProfile} from '../api/profile'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then(response => response.data),
  })
}
