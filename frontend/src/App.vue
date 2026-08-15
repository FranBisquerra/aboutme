<template>
  <UApp :toaster="{position: 'top-right'}">
    <component :is="layout">
      <RouterView/>
    </component>
  </UApp>
</template>

<script setup lang="ts">
import {computed, watch} from 'vue'
import {storeToRefs} from 'pinia'
import {useRoute} from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import {type FlashMessage, useFlashStore} from './stores/flash'

const route = useRoute()
const layout = computed(() => (route.meta.layout === 'admin' ? AdminLayout : DefaultLayout))

const toast = useToast()
const flash = useFlashStore()
const {message} = storeToRefs(flash)

const colorBySeverity: Record<FlashMessage['severity'], 'success' | 'info' | 'warning' | 'error'> = {
  success: 'success',
  info: 'info',
  warn: 'warning',
  error: 'error',
}

watch(message, (value) => {
  if (value) {
    toast.add({title: value.summary, description: value.detail, color: colorBySeverity[value.severity]})
    flash.clear()
  }
})
</script>
