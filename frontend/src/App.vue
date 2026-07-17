<template>
  <Navbar/>
  <RouterView/>
  <Footer/>
  <Toast position="top-right"/>
</template>

<script setup lang="ts">
import {watch} from 'vue'
import {storeToRefs} from 'pinia'
import {useToast} from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import {useFlashStore} from './stores/flash'

const toast = useToast()
const flash = useFlashStore()
const {message} = storeToRefs(flash)

// Turn flash messages (set from outside a component context, e.g. the router guard) into a Toast.
watch(message, (value) => {
  if (value) {
    toast.add({...value, life: 4000})
    flash.clear()
  }
})
</script>
