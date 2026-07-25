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
  </div>
</template>

<script setup lang="ts">
import {reactive, watch} from 'vue'
import type {FormSubmitEvent} from '@nuxt/ui'
import {useProfile, useUpdateProfile} from '../../../queries/profile'
import {profileSchema} from '../../../schemas/profile'
import type {UpdateProfileRequest} from '../../../types/profile'

const toast = useToast()

const {data: profile} = useProfile()
const {mutate: updateMutate, isPending, isError} = useUpdateProfile()

const state = reactive<UpdateProfileRequest>({
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

function onSubmit(event: FormSubmitEvent<UpdateProfileRequest>) {
  updateMutate(event.data, {
    onSuccess: () => toast.add({title: 'Profile updated', color: 'success'}),
  })
}
</script>
