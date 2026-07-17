<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-6">
    <div class="w-full max-w-lg">
      <template v-if="!isSuccess">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact me</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">Send me a message and I'll get back to you.</p>
      </template>

      <UForm v-if="!isSuccess" :schema="contactSchema" :state="state" class="flex flex-col gap-5" @submit="onSubmit">
        <UFormField label="Name" name="name">
          <UInput id="name" v-model="state.name" placeholder="Your name" class="w-full"/>
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput id="email" v-model="state.email" type="email" placeholder="your@email.com" class="w-full"/>
        </UFormField>

        <UFormField label="Message" name="message">
          <UTextarea id="message" v-model="state.message" :rows="5" placeholder="Your message..." class="w-full"/>
        </UFormField>

        <UAlert v-if="isError" color="error" variant="subtle" title="Something went wrong. Please try again."/>

        <UButton type="submit" label="Send message" :loading="isPending" block/>
      </UForm>

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
import {reactive} from 'vue'
import type {FormSubmitEvent} from '@nuxt/ui'
import {useMutation} from '@tanstack/vue-query'
import {sendContactMessage} from '../../../api/contact'
import {contactSchema} from '../../../schemas/contact'
import type {ContactRequest} from '../../../types/contact'

const state = reactive({name: '', email: '', message: ''})

const {mutate, isPending, isError, isSuccess} = useMutation({
  mutationFn: (data: ContactRequest) => sendContactMessage(data),
})

function onSubmit(event: FormSubmitEvent<ContactRequest>) {
  mutate(event.data)
}
</script>
