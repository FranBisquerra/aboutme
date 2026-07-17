import {mount} from '@vue/test-utils'
import {createRouter, createWebHistory, type Router} from 'vue-router'
import {createPinia, type Pinia} from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
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
      {path: '/contact', component: stub},
    ],
  })
}

interface MountOptions {
  router?: Router
  pinia?: Pinia
  props?: Record<string, unknown>
}

/**
 * Mounts a page/component with the plugins the app uses: router, Pinia, PrimeVue and
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
    global: {
      plugins: [router, pinia, PrimeVue, ToastService, [VueQueryPlugin, {queryClient}]],
    },
  })
}
