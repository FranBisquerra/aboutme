import {computed, reactive, ref} from 'vue'
import {useToast} from '@nuxt/ui/composables'
import {useProfile, useUpdateProfile} from '../../../queries/profile'
import type {Profile, UpdateProfileRequest} from '../../../types/profile'

/** Profile lists edited as a table + form: one entry per row. `skills` is excluded — it is a tag input. */
export type EntrySectionKey = 'experience' | 'education' | 'courses' | 'languages'

type Entry<K extends EntrySectionKey> = Profile[K][number]

/**
 * Add / edit / delete one list of the profile. Every action saves the *whole* document
 * (see AGENTS.md — Profile is a single aggregate), so a section only replaces its own list
 * and leaves the rest of the profile untouched.
 *
 * `label` is the singular name used in the success toasts ("Experience added").
 *
 * `sort` reorders the entries for display. Everything here addresses entries **by index**,
 * so the sort has to happen at the source: sorting only in the template would make edit and
 * delete act on the wrong row. Saving then persists that order, which is harmless — the
 * stored order carries no meaning.
 */
export function useProfileSection<K extends EntrySectionKey>(
  key: K,
  label: string,
  blank: () => Entry<K>,
  sort: (entries: Entry<K>[]) => Entry<K>[] = entries => entries,
) {
  const toast = useToast()
  const {data: profile} = useProfile()
  const {mutate, isPending: isSaving, isError} = useUpdateProfile()

  const entries = computed(() => sort((profile.value?.[key] ?? []) as Entry<K>[]))

  const formOpen = ref(false)
  const editingIndex = ref<number | null>(null)
  const isEditing = computed(() => editingIndex.value !== null)
  const form = reactive(blank()) as Entry<K>

  const deleteOpen = ref(false)
  const deletingIndex = ref<number | null>(null)
  const deleting = computed(() =>
    deletingIndex.value === null ? null : entries.value[deletingIndex.value])

  function save(next: Entry<K>[], message: string, close: () => void) {
    mutate({...profile.value!, [key]: next} as UpdateProfileRequest, {
      onSuccess: () => {
        close()
        toast.add({title: message, color: 'success'})
      },
    })
  }

  function openCreate() {
    editingIndex.value = null
    Object.assign(form, blank())
    formOpen.value = true
  }

  function openEdit(index: number) {
    editingIndex.value = index
    Object.assign(form, entries.value[index])
    formOpen.value = true
  }

  function submit(data: Entry<K>) {
    const index = editingIndex.value
    const next = [...entries.value]
    if (index === null) {
      next.push(data)
    } else {
      next[index] = data
    }
    save(next, `${label} ${index === null ? 'added' : 'updated'}`, () => {
      formOpen.value = false
    })
  }

  function askDelete(index: number) {
    deletingIndex.value = index
    deleteOpen.value = true
  }

  function confirmDelete() {
    if (deletingIndex.value === null) return
    const next = entries.value.filter((_, index) => index !== deletingIndex.value)
    save(next, `${label} deleted`, () => {
      deleteOpen.value = false
    })
  }

  return {
    entries, form, isEditing, isSaving, isError,
    formOpen, openCreate, openEdit, submit,
    deleteOpen, deleting, askDelete, confirmDelete,
  }
}
