<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-6">
    <div class="w-full max-w-sm">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin login</h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8">Sign in to access the backoffice.</p>

      <UForm :schema="loginSchema" :state="state" class="flex flex-col gap-5" @submit="onSubmit">
        <UFormField label="Username" name="username">
          <UInput id="username" v-model="state.username" placeholder="admin" class="w-full"/>
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput id="password" v-model="state.password" type="password" placeholder="••••••••" class="w-full"/>
        </UFormField>

        <UAlert v-if="isError" color="error" variant="subtle" title="Invalid username or password."/>

        <UButton type="submit" label="Sign in" :loading="isPending" block/>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import type {FormSubmitEvent} from '@nuxt/ui'
import {useMutation} from '@tanstack/vue-query'
import {useRouter} from 'vue-router'
import {login} from '../../../api/auth'
import {useAuthStore} from '../../../stores/auth'
import {loginSchema} from '../../../schemas/auth'
import type {LoginRequest} from '../../../types/auth'

const router = useRouter()
const auth = useAuthStore()

const state = reactive({username: '', password: ''})

const {mutate: loginMutate, isPending, isError} = useMutation({
  mutationFn: (data: LoginRequest) => login(data),
  onSuccess: ({data}) => {
    auth.setToken(data.token)
    router.push('/')
  },
})

function onSubmit(event: FormSubmitEvent<LoginRequest>) {
  loginMutate(event.data)
}
</script>
