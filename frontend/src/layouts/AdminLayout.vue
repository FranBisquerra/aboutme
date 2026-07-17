  <template>
  <UDashboardGroup storage="local" storage-key="admin-sidebar">
    <UDashboardSidebar collapsible :ui="{footer: 'flex-col gap-2', header: 'relative'}">
      <template #header="{collapsed}">
        <UAvatar icon="i-lucide-user"/>
        <span v-if="!collapsed" class="font-semibold text-highlighted truncate">{{ username }}</span>
        <UDashboardSidebarCollapse
          size="xs"
          class="absolute top-1/2 -translate-y-1/2 -right-3 z-10 rounded-full border border-default bg-default"
        />
      </template>

      <template #default="{collapsed}">
        <UNavigationMenu :collapsed="collapsed" :items="navItems" orientation="vertical"/>
      </template>

      <template #footer="{collapsed}">
        <UButton
          icon="i-lucide-log-out"
          :label="collapsed ? undefined : 'Logout'"
          color="neutral"
          variant="ghost"
          block
          aria-label="Logout"
          @click="logout"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Admin">
          <template #right>
            <UButton to="/" icon="i-lucide-external-link" color="neutral" variant="ghost" size="sm" label="Site"/>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot/>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useRouter} from 'vue-router'
import type {NavigationMenuItem} from '@nuxt/ui'
import {useAuthStore} from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const {username} = storeToRefs(auth)

const navItems: NavigationMenuItem[] = [
  {label: 'Profile', icon: 'i-lucide-user', to: '/admin/profile'},
]

function logout() {
  auth.clear()
  router.push('/')
}
</script>
