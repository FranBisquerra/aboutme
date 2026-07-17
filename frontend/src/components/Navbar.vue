<template>
  <nav
    class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 z-50">
    <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          v-if="isAdminRoute"
          type="button"
          aria-label="Toggle admin sidebar"
          @click="sidebar.toggle()"
          class="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <i class="pi pi-bars text-lg"/>
        </button>
        <span class="font-semibold text-gray-900 dark:text-white tracking-tight">
          <RouterLink to="/">franbisquerra</RouterLink>
        </span>
      </div>
      <div v-if="!isAdminRoute" class="flex items-center">
        <button
          type="button"
          aria-label="Account menu"
          aria-haspopup="true"
          @click="toggleMenu"
          class="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <i class="pi pi-user text-lg"/>
        </button>
        <Menu ref="menu" :model="menuItems" :popup="true"/>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useRoute, useRouter} from 'vue-router'
import Menu from 'primevue/menu'
import type {MenuItem} from 'primevue/menuitem'
import {useAuthStore} from '../stores/auth'
import {useSidebarStore} from '../stores/sidebar'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebar = useSidebarStore()
const {isAuthenticated} = storeToRefs(auth)

// In the admin area the sidebar drawer owns navigation and logout.
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const menu = ref<InstanceType<typeof Menu>>()

function toggleMenu(event: MouseEvent) {
  menu.value?.toggle(event)
}

const menuItems = computed<MenuItem[]>(() =>
  isAuthenticated.value
    ? [
      {label: 'Admin', icon: 'pi pi-cog', command: () => router.push('/admin')},
    ]
    : [
      {label: 'Login', icon: 'pi pi-sign-in', command: () => router.push('/login')},
    ],
)
</script>
