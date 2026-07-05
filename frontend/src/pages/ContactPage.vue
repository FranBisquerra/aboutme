<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-6">
    <div class="w-full max-w-lg">
      <template v-if="!isSuccess">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact me</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">Send me a message and I'll get back to you.</p>
      </template>

      <Form v-if="!isSuccess" v-slot="$form" :resolver="resolver" :initial-values="initialValues" class="flex flex-col gap-5"
            @submit="onFormSubmit">
        <div class="flex flex-col gap-1">
          <label for="name" class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <InputText id="name" name="name" type="text" placeholder="Your name" fluid/>
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
            {{ $form.name.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <InputText id="email" name="email" type="email" placeholder="your@email.com" fluid/>
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
            {{ $form.email.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="message" class="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <Textarea id="message" name="message" rows="5" placeholder="Your message..." fluid/>
          <Message v-if="$form.message?.invalid" severity="error" size="small" variant="simple">
            {{ $form.message.error?.message }}
          </Message>
        </div>

        <Message v-if="isError" severity="error" size="small" variant="simple">
          Something went wrong. Please try again.
        </Message>

        <Button type="submit" label="Send message" :loading="isPending"/>
      </Form>

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
import {Form, type FormSubmitEvent} from '@primevue/forms'
import {zodResolver} from '@primevue/forms/resolvers/zod'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Message from 'primevue/message'
import {useMutation} from '@tanstack/vue-query'
import {sendContactMessage} from '../api/contact'
import {contactSchema} from '../schemas/contact'
import type {ContactRequest} from '../types/contact'

const resolver = zodResolver(contactSchema)
const initialValues = {name: '', email: '', message: ''}

const {mutate, isPending, isError, isSuccess} = useMutation({
  mutationFn: (data: ContactRequest) => sendContactMessage(data),
})

function onFormSubmit({valid, values}: FormSubmitEvent) {
  if (valid) {
    mutate(values as ContactRequest)
  }
}
</script>
