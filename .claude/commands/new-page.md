# /new-page — Create a New Frontend Page

Standard recipe for adding a page to the Vue 3 frontend (vue-router + Pinia + Tailwind).
Goal: every page is built the same way, ending the current split between "composer" pages
(`HomePage.vue`) and "self-contained" pages (`ContactPage.vue`).

## Folder structure & naming

```
frontend/src/
├── pages/{Name}Page.vue        ← route-level SMART component (orchestrates data + async state)
├── components/{Name}.vue       ← PRESENTATIONAL component (props in / emits out, no fetching)
├── router/index.ts             ← register { path, component }
├── router/router.test.ts       ← add a "resolves to {Name}Page" case
├── api/{domain}.ts             ← thin functions over the shared axios client
├── types/{domain}.ts           ← TS interfaces mirroring the backend DTOs
├── stores/{domain}.ts          ← Pinia store, ONLY for shared/cacheable data
└── {anything}.test.ts          ← tests live next to the file they cover
```

## The two rules that resolve the inconsistency

### 1. Where data comes from

| Situation | Use |
|-----------|-----|
| Data shared across pages and cacheable (e.g. `profile`) | **Pinia store** (`stores/{domain}.ts`) — dedups + exposes `loading`/`error` |
| One-shot action of a single page (form submit, login, page-specific fetch) | **Call `api/{domain}.ts` directly** from the page |

Never call `axios` directly in a page/component — always go through `api/*.ts` (which uses
`api/client.ts`, baseURL `/api`).

### 2. Who orchestrates (page vs component)

- **Page (smart)** — lives in `pages/`. Orchestrates data (store or api), owns the async UI
  state, handles routing, and passes data **down as props** to presentational components.
- **Component (presentational)** — lives in `components/`. Receives props, emits events.
  It does **not** call `api/*`, does **not** trigger `store.fetch()`, and does **not** load
  data in `onMounted`.

## Async state convention

Use a `Status` union for page-level async (same as `ContactPage.vue`):

```ts
type Status = 'idle' | 'loading' | 'success' | 'error'
```

Stores that do async expose `loading` and `error` next to the data (see store template below).
(If this `Status` boilerplate ever repeats too much, extract a `useAsyncAction` composable in
`utils/` — not before, YAGNI.)

---

## Templates

### A) Smart page — direct api call (forms, login, one-shot actions)

```vue
<template>
  <section class="...tailwind wrapper...">
    <form v-if="status !== 'success'" @submit.prevent="submit" novalidate>
      <!-- inputs bound with v-model -->
      <p v-if="status === 'error'" class="text-sm text-red-500">Something went wrong.</p>
      <button type="submit" :disabled="status === 'loading'">
        {{ status === 'loading' ? 'Sending...' : 'Submit' }}
      </button>
    </form>
    <div v-else><!-- success state --></div>
  </section>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {someAction} from '../api/{domain}'

type Status = 'idle' | 'loading' | 'success' | 'error'

const status = ref<Status>('idle')
const form = reactive({/* fields */})

async function submit() {
  status.value = 'loading'
  try {
    await someAction(form)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
}
</script>
```

### B) Smart page — store-backed (shared/cacheable data)

```vue
<template>
  <p v-if="loading">Loading…</p>
  <p v-else-if="error" class="text-red-500">{{ error }}</p>
  <SomeView v-else-if="data" :data="data" />
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useDomainStore} from '../stores/{domain}'
import SomeView from '../components/SomeView.vue'

const store = useDomainStore()
const {data, loading, error} = storeToRefs(store)

onMounted(() => store.fetch())   // the PAGE triggers the fetch, not the child component
</script>
```

### C) Store (Pinia setup) — dedup + loading/error

```ts
import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {Domain} from '../types/{domain}'
import {getDomain} from '../api/{domain}'

export const useDomainStore = defineStore('{domain}', () => {
    const data = ref<Domain | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetch() {
        if (data.value) return            // dedup: already loaded
        loading.value = true
        error.value = null
        try {
            const response = await getDomain()
            data.value = response.data
        } catch {
            error.value = 'Failed to load'
        } finally {
            loading.value = false
        }
    }

    return {data, loading, error, fetch}
})
```

### D) api + types

```ts
// api/{domain}.ts
import type {Domain} from '../types/{domain}'
import client from './client'

export const getDomain = () => client.get<Domain>('/{domain}')
export const someAction = (data: SomeRequest) => client.post('/{domain}/action', data)
```

```ts
// types/{domain}.ts — mirror the backend DTO exactly
export interface Domain { /* fields */ }
```

### E) Page test (Vitest + @vue/test-utils)

```ts
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import {createRouter, createWebHistory} from 'vue-router'
import MyPage from './MyPage.vue'
import * as domainApi from '../api/{domain}'

const router = createRouter({history: createWebHistory(), routes: [{path: '/', component: {}}]})

describe('MyPage', () => {
    beforeEach(() => vi.restoreAllMocks())

    it('renders its fields', () => {
        const wrapper = mount(MyPage, {global: {plugins: [router]}})
        expect(wrapper.find('#field').exists()).toBe(true)
    })

    it('shows the loading state while the action runs', async () => {
        vi.spyOn(domainApi, 'someAction').mockReturnValue(new Promise(() => {}))
        const wrapper = mount(MyPage, {global: {plugins: [router]}})
        await wrapper.find('form').trigger('submit')
        expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    })

    it('calls the api with the form data', async () => {
        const spy = vi.spyOn(domainApi, 'someAction').mockResolvedValue({} as any)
        const wrapper = mount(MyPage, {global: {plugins: [router]}})
        await wrapper.find('#field').setValue('x')
        await wrapper.find('form').trigger('submit')
        expect(spy).toHaveBeenCalledWith({field: 'x'})
    })
})
```

Store-backed pages: mount with a real Pinia (`createPinia()`) as a plugin and spy the api module.
Also add the route to `router/router.test.ts`.

---

## Checklist

- [ ] Page in `pages/{Name}Page.vue`; route registered in `router/index.ts` (+ case in `router.test.ts`)
- [ ] Data via the correct path (shared → store; one-shot → direct `api/*.ts`)
- [ ] The page owns the async state (`Status` union, or `loading`/`error` from the store)
- [ ] New components in `components/` are presentational (props/emits, no fetching)
- [ ] `api/{domain}.ts` + `types/{domain}.ts` added if there is a new endpoint
- [ ] Test `{Name}Page.test.ts` (render + loading/success/error); api spied with `vi.spyOn`
- [ ] `npm run test` and `vue-tsc` green

## Hard rules

- Presentational components never call `api/*` nor trigger a fetch.
- Every HTTP call goes through `api/*.ts` over `client` — never raw `axios` in a page.
- Types live in `types/*.ts`, not inline in the page.
- **Known exception (pre-standard debt):** `stores/profile.ts` + `components/Home.vue` fetch
  inside the component. They predate this standard and are to be aligned later — do not copy them.
