  <template>
  <UDashboardGroup storage="local" storage-key="admin-sidebar">
    <UDashboardSidebar collapsible :ui="{footer: 'flex-col gap-2', header: 'relative'}">
      <template #header="{collapsed}">
        <RouterLink to="/admin" class="flex items-center gap-2 min-w-0">
          <UAvatar icon="i-lucide-user"/>
          <span v-if="!collapsed" class="font-semibold text-highlighted truncate">{{ username }}</span>
        </RouterLink>
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
        <UDashboardNavbar :title="pageTitle">
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
import {computed} from 'vue'
import {storeToRefs} from 'pinia'
import {useRoute, useRouter} from 'vue-router'
import type {NavigationMenuItem} from '@nuxt/ui'
import {useAuthStore} from '../stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const {username} = storeToRefs(auth)

const pageTitle = computed(() => (route.meta.title as string | undefined) ?? 'Admin')

const navItems: NavigationMenuItem[] = [
  {label: 'Profile', icon: 'i-lucide-user', to: '/admin/profile'},
]

function logout() {
  auth.clear()
  router.push('/')
}
</script>
