import {ref} from 'vue'
import {defineStore} from 'pinia'

export interface FlashMessage {
  severity: 'success' | 'info' | 'warn' | 'error'
  summary: string
  detail?: string
}

// Lets code outside a component context (e.g. router guards) raise a notification,
// which App.vue then turns into a toast — a toast can't be created from there directly.
export const useFlashStore = defineStore('flash', () => {
  const message = ref<FlashMessage | null>(null)

  function notify(value: FlashMessage) {
    message.value = value
  }

  function clear() {
    message.value = null
  }

  return {message, notify, clear}
})
