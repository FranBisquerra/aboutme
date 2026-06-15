<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-6">
    <div class="w-full max-w-sm">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin login</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8">Sign in to access the backoffice.</p>

      <form @submit.prevent="submit" class="flex flex-col gap-5" novalidate>
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <input
              id="username"
              v-model="form.username"
              type="text"
              placeholder="admin"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
        </div>

        <p v-if="status === 'error'" class="text-sm text-red-500">
          Invalid username or password.
        </p>

        <button
            type="submit"
            :disabled="status === 'loading'"
            class="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ status === 'loading' ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {login} from '../api/auth'
import {useAuthStore} from '../stores/auth'

type Status = 'idle' | 'loading' | 'success' | 'error'

const router = useRouter()
const auth = useAuthStore()

const status = ref<Status>('idle')
const form = reactive({username: '', password: ''})
const errors = reactive({username: '', password: ''})

function validate(): boolean {
  errors.username = form.username.trim() ? '' : 'Username is required'
  errors.password = form.password ? '' : 'Password is required'
  return !errors.username && !errors.password
}

async function submit() {
  if (!validate()) return
  status.value = 'loading'
  try {
    const {data} = await login(form)
    auth.setToken(data.token)
    status.value = 'success'
    await router.push('/admin')
  } catch {
    status.value = 'error'
  }
}
</script>
