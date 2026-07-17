<template>
  <UApp :toaster="{position: 'top-right'}">
    <Navbar/>
    <RouterView/>
    <Footer/>
  </UApp>
</template>

<script setup lang="ts">
import {watch} from 'vue'
import {storeToRefs} from 'pinia'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import {type FlashMessage, useFlashStore} from './stores/flash'

const toast = useToast()
const flash = useFlashStore()
const {message} = storeToRefs(flash)

const colorBySeverity: Record<FlashMessage['severity'], 'success' | 'info' | 'warning' | 'error'> = {
  success: 'success',
  info: 'info',
  warn: 'warning',
  error: 'error',
}

// Turn flash messages (set from outside a component context, e.g. the router guard) into a toast.
watch(message, (value) => {
  if (value) {
    toast.add({title: value.summary, description: value.detail, color: colorBySeverity[value.severity]})
    flash.clear()
  }
})
</script>
