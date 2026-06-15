<template>
  <nav
      class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-50">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <span class="font-semibold text-gray-900 dark:text-white tracking-tight">
        <RouterLink to="/">franbisquerra</RouterLink>
      </span>
      <ul class="flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
        <li><RouterLink to="/contact" class="hover:text-gray-900 dark:hover:text-white transition-colors">Contact me!</RouterLink></li>
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
        <li>
          <button
              @click="toggleDark"
              class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Toggle dark mode"
          >
            <svg v-if="dark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {ref, watchEffect} from 'vue'
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

const dark = ref(
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
)

watchEffect(() => {
  document.documentElement.classList.toggle('dark', dark.value)
  localStorage.setItem('theme', dark.value ? 'dark' : 'light')
})

function toggleDark() {
  dark.value = !dark.value
}
</script>
