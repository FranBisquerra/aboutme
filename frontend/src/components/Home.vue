<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <section v-if="profile" id="about" class="max-w-5xl mx-auto px-6 pt-40 pb-24">
      <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 tracking-wide uppercase">Hi, I'm</p>
      <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{{ profile.name }}</h1>
      <p class="text-xl text-indigo-500 dark:text-indigo-400 font-medium mb-6">{{ profile.title }}</p>
      <p class="text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed mb-10">{{ profile.bio }}</p>
      <div class="flex gap-4 mb-16">
        <a href="#experience" class="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          See experience
        </a>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in profile.skills"
          :key="skill"
          class="px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
        >
          {{ skill }}
        </span>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profile.js'

const store = useProfileStore()
const { profile } = storeToRefs(store)

onMounted(() => store.fetch())
</script>
