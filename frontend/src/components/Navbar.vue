<template>
  <nav
      class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-50">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <span class="font-semibold text-gray-900 dark:text-white tracking-tight">
        <RouterLink to="/">franbisquerra</RouterLink>
      </span>
      <ul class="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
        <li v-if="!isAuthenticated">
          <RouterLink
              to="/login"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >Login</RouterLink>
        </li>
        <li v-else>
          <button
              @click="logout"
              aria-label="Logout"
              class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import {useAuthStore} from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const {isAuthenticated} = storeToRefs(auth)

function logout() {
  auth.clear()
  router.push('/')
}
</script>
