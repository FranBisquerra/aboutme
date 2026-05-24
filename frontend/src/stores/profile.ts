import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Profile } from '../types/profile'
import { getProfile } from '../api/profile'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null)

  async function fetch() {
    if (profile.value) return
    const response = await getProfile()
    profile.value = response.data
  }

  return { profile, fetch }
})
