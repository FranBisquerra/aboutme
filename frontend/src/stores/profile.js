import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getProfile } from '../api/profile.js'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)

  async function fetch() {
    if (profile.value) return
    const response = await getProfile()
    profile.value = response.data
  }

  return { profile, fetch }
})
