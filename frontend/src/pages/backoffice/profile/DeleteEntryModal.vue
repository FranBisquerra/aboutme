<template>
  <UModal :open="open" :title="title" @update:open="$emit('update:open', $event)">
    <template #body>
      <p class="text-gray-600 dark:text-gray-300">
        Delete “{{ label }}”? This cannot be undone.
      </p>
      <UAlert v-if="error" color="error" variant="subtle" :title="`Could not save the ${entity}.`" class="mt-4"/>
    </template>
    <template #footer>
      <UButton label="Cancel" color="neutral" variant="ghost" @click="$emit('update:open', false)"/>
      <UButton label="Delete" color="error" :loading="loading" @click="$emit('confirm')"/>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  /** Human description of the row being deleted, e.g. "Senior Dev · Acme". */
  label: string
  /** Lowercase noun used in the error message, e.g. "experience". */
  entity: string
  loading: boolean
  error: boolean
}>()

defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()
</script>
