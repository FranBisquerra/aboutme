<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-6">
    <div class="w-full max-w-lg">
      <template v-if="status !== 'success'">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact me</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">Send me a message and I'll get back to you.</p>
      </template>

      <form v-if="status !== 'success'" @submit.prevent="submit" class="flex flex-col gap-5" novalidate>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Your name"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="your@email.com"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
          <textarea
              id="message"
              v-model="form.message"
              required
              rows="5"
              placeholder="Your message..."
              class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <p v-if="status === 'error'" class="text-sm text-red-500">
          Something went wrong. Please try again.
        </p>

        <button
            type="submit"
            :disabled="status === 'loading'"
            class="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ status === 'loading' ? 'Sending...' : 'Send message' }}
        </button>
      </form>

      <div v-else class="text-center py-12">
        <p class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Message sent!</p>
        <p class="text-gray-500 dark:text-gray-400 mb-6">Thanks for reaching out. I'll get back to you soon.</p>
        <RouterLink to="/" class="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors">
          Back to home
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {sendContactMessage} from '../api/contact'

type Status = 'idle' | 'loading' | 'success' | 'error'

const status = ref<Status>('idle')
const form = reactive({name: '', email: '', message: ''})

async function submit() {
  status.value = 'loading'
  try {
    await sendContactMessage(form)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}
</script>
