<template>
  <main
    id="about"
    class="relative min-h-screen flex items-center bg-cover bg-center bg-gray-900"
    style="background-image: url('/images/hero4.jpg')"
  >
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/50" />

    <section v-if="profile" class="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <!-- text -->
        <div>
          <p class="text-sm font-medium text-indigo-300 mb-4 tracking-wide uppercase">Hi, I'm</p>
          <h1 class="text-5xl font-bold text-white mb-4 leading-tight">{{ profile.name }}</h1>
          <p class="text-xl text-indigo-200 font-medium mb-6">{{ profile.title }}</p>
          <p class="text-lg text-gray-100 max-w-xl leading-relaxed mb-10">{{ profile.bio }}</p>
          <div class="flex gap-4 mb-12">
            <a href="#experience" class="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors">
              See experience
            </a>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in profile.skills"
              :key="skill"
              class="px-3 py-1 text-xs font-medium bg-white/15 border border-white/30 text-white rounded-full"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- profile photo -->
        <div class="flex justify-center lg:justify-end">
          <div class="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-gray-700">
            <img
              src="/images/profile1.jpg"
              :alt="profile.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '../stores/profile'

const store = useProfileStore()
const { profile } = storeToRefs(store)

onMounted(() => store.fetch())
</script>
