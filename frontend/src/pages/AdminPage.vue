<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 flex">
    <aside
      :class="collapsed ? 'w-16' : 'w-60'"
      class="shrink-0 sticky top-16 h-[calc(100vh-4rem)] flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-200"
    >
      <div class="flex items-center gap-3 px-4 py-4" :class="collapsed && 'justify-center px-0'">
        <UAvatar icon="i-lucide-user" class="shrink-0"/>
        <span v-if="!collapsed" class="font-semibold text-gray-900 dark:text-white truncate">{{ username }}</span>
      </div>

      <hr class="border-gray-100 dark:border-gray-800 mx-2"/>

      <nav class="flex-1 px-2 py-4 flex flex-col gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :class="[route.path === item.to && 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white', collapsed && 'justify-center px-0']"
          :aria-label="item.label"
        >
          <UIcon :name="item.icon" class="shrink-0"/>
          <span v-if="!collapsed">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="px-2 py-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          aria-label="Logout"
          class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :class="collapsed && 'justify-center px-0'"
          @click="logout"
        >
          <UIcon name="i-lucide-log-out" class="shrink-0"/>
          <span v-if="!collapsed">Logout</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 min-w-0 px-6 py-8">
      <div class="max-w-5xl mx-auto">
        <RouterView/>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from '../stores/auth'
import {useSidebarStore} from '../stores/sidebar'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const {username} = storeToRefs(auth)
const {collapsed} = storeToRefs(useSidebarStore())

const navItems = [
  {label: 'Profile', icon: 'i-lucide-user', to: '/admin/profile'},
]

function logout() {
  auth.clear()
  router.push('/')
}
</script>
