import {ref} from 'vue'
import {defineStore} from 'pinia'

export interface FlashMessage {
  severity: 'success' | 'info' | 'warn' | 'error'
  summary: string
  detail?: string
}

/**
 * One-shot UI notifications ("flash" messages). Written from places without a component
 * context (e.g. router guards) and consumed once by App.vue, which turns them into a
 * PrimeVue Toast and calls clear().
 */
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
