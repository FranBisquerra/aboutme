import {mount} from '@vue/test-utils'
import {createRouter, createWebHistory, type Router} from 'vue-router'
import {createPinia, type Pinia} from 'pinia'
import ui from '@nuxt/ui/vue-plugin'
import {QueryClient, VueQueryPlugin} from '@tanstack/vue-query'
import type {Component} from 'vue'

const stub = {template: '<div/>'}

export function createTestRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {path: '/', component: stub},
      {path: '/login', component: stub},
      {path: '/admin', component: stub},
      {path: '/admin/profile', component: stub},
      {path: '/contact', component: stub},
    ],
  })
}

interface MountOptions {
  router?: Router
  pinia?: Pinia
  props?: Record<string, unknown>
  slots?: Record<string, string>
}

/**
 * Mounts a page/component with the plugins the app uses: router, Pinia, Nuxt UI and
 * TanStack Query (with retries disabled). Pass your own router/pinia when the test needs
 * to spy on navigation or read a store.
 */
export function mountWithPlugins(component: Component, options: MountOptions = {}) {
  const router = options.router ?? createTestRouter()
  const pinia = options.pinia ?? createPinia()
  const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}, mutations: {retry: false}},
  })

  return mount(component, {
    props: options.props,
    slots: options.slots,
    global: {
      plugins: [router, pinia, ui, [VueQueryPlugin, {queryClient}]],
    },
  })
}
