<template>
  <main
      id="about"
      class="relative min-h-screen flex items-center bg-cover bg-center bg-gray-900"
      style="background-image: url('/images/hero4.jpg')"
  >
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/50"/>

    <section v-if="profile" class="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-20">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <!-- text -->
        <div>
          <p class="text-sm font-medium text-indigo-300 mb-4 tracking-wide uppercase">Hi, I'm</p>
          <h1 class="text-5xl font-bold text-white mb-4 leading-tight">{{ profile.name }}</h1>
          <p class="text-xl text-indigo-200 font-medium mb-6">{{ profile.title }}</p>
          <p class="text-lg text-gray-100 max-w-xl leading-relaxed mb-10">{{ profile.bio }}</p>
          <div class="flex flex-wrap items-center gap-4 mb-12">
            <a href="#experience"
               class="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors">
              See experience
            </a>
            <div class="flex items-center gap-3">
              <a :href="profile.github" target="_blank" rel="noopener" aria-label="GitHub"
                 class="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
                </svg>
              </a>
              <a :href="profile.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn"
                 class="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a :href="`mailto:${profile.email}`" aria-label="Email"
                 class="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </a>
            </div>
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
        <div class="hidden lg:flex justify-end">
          <div
              class="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-gray-700">
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
import type {Profile} from '../types/profile'

defineProps<{ profile: Profile | undefined }>()
</script>
