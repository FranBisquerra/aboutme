<template>
  <section v-if="profile" id="experience" class="bg-gray-50 dark:bg-gray-950">
    <div class="max-w-5xl mx-auto px-6 py-20">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-12">Experience</h2>
      <div class="relative">
        <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"/>
        <div class="space-y-10">
          <div v-for="(job, i) in experience" :key="i" class="pl-8 relative">
            <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-indigo-500 -translate-x-[3px]"/>
            <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
              <div>
                <span class="font-semibold text-gray-900 dark:text-white">{{ job.role }}</span>
                <span class="text-gray-400 mx-2">·</span>
                <span class="text-gray-600 dark:text-gray-400">{{ job.company }}</span>
              </div>
              <span class="text-sm text-gray-400 shrink-0">{{ formatDate(job.start) }} – {{ formatDate(job.end) }}</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ job.description }}</p>
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-20 mb-12">Education</h2>
      <div v-for="(edu, i) in education" :key="i" class="pl-8 relative">
        <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-indigo-500 -translate-x-[3px]"/>
        <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"/>
        <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">{{ edu.degree }}</span>
            <span class="text-gray-400 mx-2">·</span>
            <span class="text-gray-600 dark:text-gray-400">{{ edu.institution }}</span>
          </div>
          <span class="text-sm text-gray-400 shrink-0">{{ edu.start }} – {{ edu.end }}</span>
        </div>
      </div>

      <template v-if="courses.length">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-20 mb-12">Courses</h2>
        <div class="relative">
          <div class="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"/>
          <div class="space-y-6">
            <div v-for="(course, i) in courses" :key="i" class="pl-8 relative">
              <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-indigo-500 -translate-x-[3px]"/>
              <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <div>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ course.name }}</span>
                  <span class="text-gray-400 mx-2">·</span>
                  <span class="text-gray-600 dark:text-gray-400">{{ course.institution }}</span>
                </div>
                <span class="text-sm text-gray-400 shrink-0">{{ courseYears(course) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {CourseEntry, Profile} from '../../../types/profile'
import {byStartDesc} from '../../../utils/byStartDesc'
import {formatDate} from '../../../utils/formatDate'

const props = defineProps<{ profile: Profile | undefined }>()

// The stored order is meaningless; the CV always reads most recent first.
const experience = computed(() => byStartDesc(props.profile?.experience ?? []))
const education = computed(() => byStartDesc(props.profile?.education ?? []))
const courses = computed(() => byStartDesc(props.profile?.courses ?? []))

function courseYears(course: CourseEntry): string {
  return course.end ? `${course.start} – ${course.end}` : course.start
}
</script>
