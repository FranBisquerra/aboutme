<template>
  <nav
    class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-50">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <span class="font-semibold text-gray-900 dark:text-white tracking-tight">
        <RouterLink to="/">franbisquerra</RouterLink>
      </span>
      <div class="flex items-center">
        <UDropdownMenu :items="menuItems" :modal="false">
          <button
            type="button"
            aria-label="Account menu"
            class="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <UIcon name="i-lucide-user" class="text-lg"/>
          </button>
        </UDropdownMenu>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import type {DropdownMenuItem} from '@nuxt/ui'
import {useAuthStore} from '../../../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const {isAuthenticated} = storeToRefs(auth)

const menuItems = computed<DropdownMenuItem[]>(() =>
  isAuthenticated.value
    ? [
      {label: 'Admin', icon: 'i-lucide-settings', onSelect: () => router.push('/admin')},
    ]
    : [
      {label: 'Login', icon: 'i-lucide-log-in', onSelect: () => router.push('/login')},
    ],
)
</script>
