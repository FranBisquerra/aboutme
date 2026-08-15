<template>
  <div class="w-full max-w-3xl mx-auto">
    <p class="text-gray-500 dark:text-gray-400 mb-8">Edit the public profile information.</p>

    <UForm :schema="profileSchema" :state="state" class="grid grid-cols-1 md:grid-cols-2 gap-5" @submit="onSubmit">
      <UFormField label="Name" name="name">
        <UInput id="name" v-model="state.name" class="w-full"/>
      </UFormField>

      <UFormField label="Title" name="title">
        <UInput id="title" v-model="state.title" class="w-full"/>
      </UFormField>

      <UFormField label="Location" name="location">
        <UInput id="location" v-model="state.location" class="w-full"/>
      </UFormField>

      <UFormField label="Email" name="email">
        <UInput id="email" v-model="state.email" type="email" class="w-full"/>
      </UFormField>

      <UFormField label="LinkedIn" name="linkedin">
        <UInput id="linkedin" v-model="state.linkedin" class="w-full"/>
      </UFormField>

      <UFormField label="GitHub" name="github">
        <UInput id="github" v-model="state.github" class="w-full"/>
      </UFormField>

      <UFormField label="Bio" name="bio" class="md:col-span-2">
        <UTextarea id="bio" v-model="state.bio" :rows="6" class="w-full"/>
      </UFormField>

      <UAlert v-if="isError" color="error" variant="subtle" title="Could not save the profile." class="md:col-span-2"/>

      <div class="md:col-span-2">
        <UButton type="submit" label="Save changes" :loading="isPending"/>
      </div>
    </UForm>

    <section class="mt-12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Experience</h2>
        <UButton icon="i-lucide-plus" label="Add experience" @click="openCreateExperience"/>
      </div>

      <table v-if="experience.entries.length" class="w-full text-sm">
        <thead>
          <tr class="text-left text-gray-500 dark:text-gray-400">
            <th class="py-2 font-medium">Role</th>
            <th class="py-2 font-medium">Company</th>
            <th class="py-2 font-medium">Dates</th>
            <th class="py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, index) in experience.entries" :key="index" class="border-t border-gray-100 dark:border-gray-800">
            <td class="py-2 text-gray-900 dark:text-white">{{ job.role }}</td>
            <td class="py-2 text-gray-600 dark:text-gray-300">{{ job.company }}</td>
            <td class="py-2 text-gray-600 dark:text-gray-300">{{ formatDate(job.start) }} – {{ formatDate(job.end) }}</td>
            <td class="py-2 text-right whitespace-nowrap">
              <UButton
                icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs"
                :aria-label="`Edit ${job.company}`" @click="openEditExperience(index)"
              />
              <UButton
                icon="i-lucide-trash-2" color="error" variant="ghost" size="xs"
                :aria-label="`Delete ${job.company}`" @click="experience.askDelete(index)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-gray-500 dark:text-gray-400 text-sm">No experience entries yet.</p>
    </section>

    <section class="mt-12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
        <UButton icon="i-lucide-plus" label="Add education" @click="education.openCreate"/>
      </div>

      <table v-if="education.entries.length" class="w-full text-sm">
        <thead>
          <tr class="text-left text-gray-500 dark:text-gray-400">
            <th class="py-2 font-medium">Degree</th>
            <th class="py-2 font-medium">Institution</th>
            <th class="py-2 font-medium">Years</th>
            <th class="py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in education.entries" :key="index" class="border-t border-gray-100 dark:border-gray-800">
            <td class="py-2 text-gray-900 dark:text-white">{{ entry.degree }}</td>
            <td class="py-2 text-gray-600 dark:text-gray-300">{{ entry.institution }}</td>
            <td class="py-2 text-gray-600 dark:text-gray-300">{{ entry.start }} – {{ entry.end }}</td>
            <td class="py-2 text-right whitespace-nowrap">
              <UButton
                icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs"
                :aria-label="`Edit ${entry.degree}`" @click="education.openEdit(index)"
              />
              <UButton
                icon="i-lucide-trash-2" color="error" variant="ghost" size="xs"
                :aria-label="`Delete ${entry.degree}`" @click="education.askDelete(index)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-gray-500 dark:text-gray-400 text-sm">No education entries yet.</p>
    </section>

    <section class="mt-12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Courses</h2>
        <UButton icon="i-lucide-plus" label="Add course" @click="courses.openCreate"/>
      </div>

      <table v-if="courses.entries.length" class="w-full text-sm">
        <thead>
          <tr class="text-left text-gray-500 dark:text-gray-400">
            <th class="py-2 font-medium">Course</th>
            <th class="py-2 font-medium">Institution</th>
            <th class="py-2 font-medium">Years</th>
            <th class="py-2 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(course, index) in courses.entries" :key="index" class="border-t border-gray-100 dark:border-gray-800">
            <td class="py-2 text-gray-900 dark:text-white">{{ course.name }}</td>
            <td class="py-2 text-gray-600 dark:text-gray-300">{{ course.institution }}</td>
            <td class="py-2 text-gray-600 dark:text-gray-300">{{ formatYears(course) }}</td>
            <td class="py-2 text-right whitespace-nowrap">
              <UButton
                icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs"
                :aria-label="`Edit ${course.name}`" @click="courses.openEdit(index)"
              />
              <UButton
                icon="i-lucide-trash-2" color="error" variant="ghost" size="xs"
                :aria-label="`Delete ${course.name}`" @click="courses.askDelete(index)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-gray-500 dark:text-gray-400 text-sm">No courses yet.</p>
    </section>

    <USlideover v-model:open="experience.formOpen" :title="experience.isEditing ? 'Edit experience' : 'Add experience'">
      <template #body>
        <UForm :schema="experienceSchema" :state="experience.form" class="flex flex-col gap-4" @submit="onExperienceSubmit">
          <UFormField label="Company" name="company">
            <UInput id="exp-company" v-model="experience.form.company" class="w-full"/>
          </UFormField>

          <UFormField label="Role" name="role">
            <UInput id="exp-role" v-model="experience.form.role" class="w-full"/>
          </UFormField>

          <UFormField label="Start" name="start">
            <UInput id="exp-start" v-model="experience.form.start" type="month" class="w-full"/>
          </UFormField>

          <UFormField label="End" name="end">
            <UInput id="exp-end" v-model="endModel" type="month" class="w-full" :disabled="current"/>
          </UFormField>

          <UCheckbox v-model="current" label="I currently work here"/>

          <UFormField label="Description" name="description">
            <UTextarea id="exp-description" v-model="experience.form.description" :rows="4" class="w-full"/>
          </UFormField>

          <UAlert v-if="experience.isError" color="error" variant="subtle" title="Could not save the experience."/>

          <div class="flex justify-end gap-2 pt-2">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="experience.formOpen = false"/>
            <UButton type="submit" label="Save" :loading="experience.isSaving"/>
          </div>
        </UForm>
      </template>
    </USlideover>

    <USlideover v-model:open="education.formOpen" :title="education.isEditing ? 'Edit education' : 'Add education'">
      <template #body>
        <UForm :schema="educationSchema" :state="education.form" class="flex flex-col gap-4" @submit="onEducationSubmit">
          <UFormField label="Institution" name="institution">
            <UInput id="edu-institution" v-model="education.form.institution" class="w-full"/>
          </UFormField>

          <UFormField label="Degree" name="degree">
            <UInput id="edu-degree" v-model="education.form.degree" class="w-full"/>
          </UFormField>

          <UFormField label="Start year" name="start">
            <UInput id="edu-start" v-model="education.form.start" placeholder="2012" class="w-full"/>
          </UFormField>

          <UFormField label="End year" name="end">
            <UInput id="edu-end" v-model="education.form.end" placeholder="2019" class="w-full"/>
          </UFormField>

          <UAlert v-if="education.isError" color="error" variant="subtle" title="Could not save the education."/>

          <div class="flex justify-end gap-2 pt-2">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="education.formOpen = false"/>
            <UButton type="submit" label="Save" :loading="education.isSaving"/>
          </div>
        </UForm>
      </template>
    </USlideover>

    <USlideover v-model:open="courses.formOpen" :title="courses.isEditing ? 'Edit course' : 'Add course'">
      <template #body>
        <UForm :schema="courseSchema" :state="courses.form" class="flex flex-col gap-4" @submit="onCourseSubmit">
          <UFormField label="Course" name="name">
            <UInput id="course-name" v-model="courses.form.name" class="w-full"/>
          </UFormField>

          <UFormField label="Institution" name="institution">
            <UInput id="course-institution" v-model="courses.form.institution" class="w-full"/>
          </UFormField>

          <UFormField label="Start year" name="start">
            <UInput id="course-start" v-model="courses.form.start" placeholder="2021" class="w-full"/>
          </UFormField>

          <UFormField label="End year" name="end" hint="Optional">
            <UInput id="course-end" v-model="courseEndModel" placeholder="2022" class="w-full"/>
          </UFormField>

          <UAlert v-if="courses.isError" color="error" variant="subtle" title="Could not save the course."/>

          <div class="flex justify-end gap-2 pt-2">
            <UButton label="Cancel" color="neutral" variant="ghost" @click="courses.formOpen = false"/>
            <UButton type="submit" label="Save" :loading="courses.isSaving"/>
          </div>
        </UForm>
      </template>
    </USlideover>

    <DeleteEntryModal
      v-model:open="experience.deleteOpen"
      title="Delete experience"
      entity="experience"
      :label="`${experience.deleting?.role} · ${experience.deleting?.company}`"
      :loading="experience.isSaving"
      :error="experience.isError"
      @confirm="experience.confirmDelete"
    />

    <DeleteEntryModal
      v-model:open="education.deleteOpen"
      title="Delete education"
      entity="education"
      :label="`${education.deleting?.degree} · ${education.deleting?.institution}`"
      :loading="education.isSaving"
      :error="education.isError"
      @confirm="education.confirmDelete"
    />

    <DeleteEntryModal
      v-model:open="courses.deleteOpen"
      title="Delete course"
      entity="course"
      :label="`${courses.deleting?.name} · ${courses.deleting?.institution}`"
      :loading="courses.isSaving"
      :error="courses.isError"
      @confirm="courses.confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue'
import type {FormSubmitEvent} from '@nuxt/ui'
import DeleteEntryModal from './DeleteEntryModal.vue'
import {useProfileSection} from './useProfileSection'
import {useProfile, useUpdateProfile} from '../../../queries/profile'
import {courseSchema, educationSchema, experienceSchema, profileSchema} from '../../../schemas/profile'
import type {CourseEntry, EducationEntry, ExperienceEntry, ProfileBasics} from '../../../types/profile'
import {byStartDesc} from '../../../utils/byStartDesc'
import {formatDate} from '../../../utils/formatDate'

const toast = useToast()

const {data: profile} = useProfile()
const {mutate: updateMutate, isPending, isError} = useUpdateProfile()

const state = reactive<ProfileBasics>({
  name: '',
  title: '',
  location: '',
  email: '',
  linkedin: '',
  github: '',
  bio: '',
})

watch(profile, current => {
  if (!current) return
  state.name = current.name
  state.title = current.title
  state.location = current.location
  state.email = current.email
  state.linkedin = current.linkedin
  state.github = current.github
  state.bio = current.bio
}, {immediate: true})

function onSubmit(event: FormSubmitEvent<ProfileBasics>) {
  updateMutate({...profile.value!, ...event.data}, {
    onSuccess: () => toast.add({title: 'Profile updated', color: 'success'}),
  })
}

const experience = reactive(useProfileSection('experience', 'Experience', () => ({
  company: '', role: '', start: '', end: null, description: '',
}), byStartDesc))

const education = reactive(useProfileSection('education', 'Education', () => ({
  institution: '', degree: '', start: '', end: '',
}), byStartDesc))

function onExperienceSubmit(event: FormSubmitEvent<ExperienceEntry>) {
  experience.submit(event.data)
}

function onEducationSubmit(event: FormSubmitEvent<EducationEntry>) {
  education.submit(event.data)
}

const courses = reactive(useProfileSection('courses', 'Course', () => ({
  institution: '', name: '', start: '', end: null,
}), byStartDesc))

function onCourseSubmit(event: FormSubmitEvent<CourseEntry>) {
  courses.submit(event.data)
}

const courseEndModel = computed({
  get: () => courses.form.end ?? '',
  set: (value: string) => {
    courses.form.end = value === '' ? null : value
  },
})

function formatYears(course: CourseEntry): string {
  return course.end ? `${course.start} – ${course.end}` : course.start
}

const current = ref(false)

const endModel = computed({
  get: () => experience.form.end ?? '',
  set: (value: string) => {
    experience.form.end = value === '' ? null : value
  },
})

watch(current, isCurrent => {
  if (isCurrent) experience.form.end = null
})

function openCreateExperience() {
  experience.openCreate()
  current.value = false
}

function openEditExperience(index: number) {
  experience.openEdit(index)
  current.value = experience.entries[index].end === null
}
</script>
