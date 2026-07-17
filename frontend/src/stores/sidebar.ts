import {ref} from 'vue'
import {defineStore} from 'pinia'

/**
 * Collapse state of the admin sidebar. Toggled from the Navbar hamburger and
 * consumed by the AdminPage layout (rail: expanded = icons + labels, collapsed = icons only).
 */
export const useSidebarStore = defineStore('sidebar', () => {
  const collapsed = ref(false)

  function toggle() {
    collapsed.value = !collapsed.value
  }

  return {collapsed, toggle}
})
