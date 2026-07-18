import {useMutation, useQuery, useQueryClient} from '@tanstack/vue-query'
import {getProfile, updateProfile} from '../api/profile'
import type {UpdateProfileRequest} from '../types/profile'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then(response => response.data),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data).then(response => response.data),
    onSuccess: updated => queryClient.setQueryData(['profile'], updated),
  })
}
