<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-6">
    <div class="w-full max-w-sm">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin login</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8">Sign in to access the backoffice.</p>

      <Form v-slot="$form" :resolver="resolver" :initial-values="initialValues" class="flex flex-col gap-5" @submit="onFormSubmit">
        <div class="flex flex-col gap-1">
          <label for="username" class="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <InputText id="username" name="username" type="text" placeholder="admin" fluid/>
          <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
            {{ $form.username.error?.message }}
          </Message>
        </div>

        <div class="flex flex-col gap-1">
          <label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <Password input-id="password" name="password" placeholder="••••••••" :feedback="false" toggle-mask fluid/>
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
            {{ $form.password.error?.message }}
          </Message>
        </div>

        <Message v-if="isError" severity="error" size="small" variant="simple">
          Invalid username or password.
        </Message>

        <Button type="submit" label="Sign in" :loading="isPending"/>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Form, type FormSubmitEvent} from '@primevue/forms'
import {zodResolver} from '@primevue/forms/resolvers/zod'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import {useMutation} from '@tanstack/vue-query'
import {useRouter} from 'vue-router'
import {login} from '../api/auth'
import {useAuthStore} from '../stores/auth'
import {loginSchema} from '../schemas/auth'
import type {LoginRequest} from '../types/auth'

const router = useRouter()
const auth = useAuthStore()

const resolver = zodResolver(loginSchema)
const initialValues = {username: '', password: ''}

const {mutate: loginMutate, isPending, isError} = useMutation({
  mutationFn: (data: LoginRequest) => login(data),
  onSuccess: ({data}) => {
    auth.setToken(data.token)
    router.push('/admin')
  },
})

function onFormSubmit({valid, values}: FormSubmitEvent) {
  if (valid) {
    loginMutate(values as LoginRequest)
  }
}
</script>
