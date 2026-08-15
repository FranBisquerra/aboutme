# /new-page — Create a New Frontend Page

Standard recipe for adding a page to the Vue 3 frontend. The stack is fixed:

- **Nuxt UI** — UI components (`U*`, auto-imported by the vite plugin; dark mode via `.dark`;
  primary color `indigo`, icons `i-lucide-*`). Layout/spacing with Tailwind 4.
- **UForm + Zod** — form state + validation (`:schema` takes the Zod schema directly).
- **TanStack Query** (`@tanstack/vue-query`) — server state (loading/error/cache) over the axios `api/*`.
- **Pinia** — client state only (e.g. the auth token). Not for server data.
- **axios** (`api/client.ts`) — transport. Wrapped by TanStack Query, never called raw in a page.

## Folder structure & naming

Pages are grouped by **domain** (`front` public / `backoffice` admin) then **feature**.
The feature folder holds the page, its test, and its feature-owned presentational
components together. Cross-cutting layers stay flat under `src/`.

```
frontend/src/
├── pages/
│   ├── front/                        ← public site
│   │   ├── components/               ← shared front chrome (Navbar, Footer, BackToTop)
│   │   └── {feature}/                ← e.g. home/, contact/, login/
│   │       ├── {Name}Page.vue        ← SMART page (orchestrates data + actions)
│   │       ├── {Name}Page.test.ts
│   │       └── {Child}.vue           ← feature-owned PRESENTATIONAL components (props in / emits out)
│   └── backoffice/                   ← admin area (guarded, admin layout)
│       └── {feature}/                ← e.g. home/, profile/
├── layouts/                          ← DefaultLayout (front) · AdminLayout (admin dashboard)
├── router/index.ts                   ← { path, component, meta:{requiresAuth?, layout?} } (+ case in router.test.ts)
├── api/{domain}.ts                   ← thin axios functions ( client.get/post<T> )
├── types/{domain}.ts                 ← TS interfaces mirroring the backend DTOs
├── schemas/{domain}.ts               ← Zod schemas (form validation, mirror backend validation)
├── queries/{domain}.ts               ← TanStack Query hooks ( useQuery / useMutation wrappers )
├── stores/{domain}.ts                ← Pinia store — CLIENT state only (token, UI)
└── test/mountWithPlugins.ts          ← test helper (router+pinia+Nuxt UI+VueQuery; accepts `slots`)
```

**Placement & layouts:**
- Public page → `pages/front/{feature}/`. Admin page → `pages/backoffice/{feature}/`,
  registered with `meta: {requiresAuth: true, layout: 'admin'}`.
- Pages **don't render Navbar/Footer** — `App.vue` wraps the route in a layout
  (`DefaultLayout` unless `meta.layout === 'admin'` → `AdminLayout`).
- Feature-owned presentational components live in the feature folder (import as `./{Child}.vue`).
  Only genuinely front-wide UI goes in `pages/front/components/`.
- **Import depth**: no path alias — from a feature folder reach `src/` layers with `../../../`
  (e.g. `../../../api/{domain}`), siblings with `./`.

## Rules

1. **Server data → TanStack Query.** Reads = `useQuery`, writes/actions = `useMutation`, both
   wrapping the `api/*.ts` axios fn. They give `data / isPending / isError / isSuccess`. Never
   hand-roll a loading/error state machine, and don't keep server data in Pinia.
2. **Client state → Pinia.** Only things that aren't server data (auth token + persistence, UI flags).
3. **Page (smart) vs component (presentational).** The page calls the query/mutation and passes
   data **down as props**. Components receive props / emit events — no `useQuery`, no `api/*`,
   no `onMounted` fetch.
4. **Forms → `UForm` + Zod.** `<UForm :schema="schema" :state="state">` with a `reactive` state
   object, `UFormField name="..."` per field (renders label + error automatically),
   `@submit` receives `FormSubmitEvent<T>` with validated `event.data`.
5. **HTTP only through `api/*.ts`** (over `client`). Types in `types/*.ts`, never inline.

### ⚠️ Gotchas (bit us already)

- **Destructure TanStack Query results** — its fields are refs; destructuring (`const {data, isPending} = useQuery(...)`) is the intended usage and lets templates auto-unwrap them. Using `q.isPending` in a template fails type-checking.
- **`U*` components and composables (`useToast`) are auto-imported** — no import lines; types come from the generated `auto-imports.d.ts`/`components.d.ts` (gitignored, created on dev/build/test).
- **Toasts**: `useToast().add({title, description, color})` — needs the `<UApp>` wrapper (already in `App.vue`).

---

## Templates

### A) Form page — `UForm` + Zod + `useMutation` (login, contact, any write)

```vue
<template>
  <UForm :schema="someSchema" :state="state" class="flex flex-col gap-5" @submit="onSubmit">
    <UFormField label="Username" name="username">
      <UInput id="username" v-model="state.username" class="w-full"/>
    </UFormField>

    <UAlert v-if="isError" color="error" variant="subtle" title="Something went wrong."/>
    <UButton type="submit" label="Submit" :loading="isPending" block/>
  </UForm>
</template>

<script setup lang="ts">
import {reactive} from 'vue'
import type {FormSubmitEvent} from '@nuxt/ui'
import {useMutation} from '@tanstack/vue-query'
import {someAction} from '../../../api/{domain}'
import {someSchema} from '../../../schemas/{domain}'
import type {SomeRequest} from '../../../types/{domain}'

const state = reactive({username: ''})

const {mutate, isPending, isError} = useMutation({
  mutationFn: (data: SomeRequest) => someAction(data),
  onSuccess: ({data}) => { /* store token, redirect, etc. */ },
})

function onSubmit(event: FormSubmitEvent<SomeRequest>) {
  mutate(event.data)
}
</script>
```

### A2) Edit form — prefill from a query, mutate updating the cache (admin profile, any edit)

Same as A, plus: the state starts empty and a `watch` copies the queried entity into it
(never bind `v-model` to query data directly), and the mutation lives in `queries/{domain}.ts`
so it can refresh the cache — the page only adds UI feedback via the per-call `onSuccess`.

```ts
const {data: entity} = useDomain()
const {mutate, isPending, isError} = useUpdateDomain()

const state = reactive<UpdateRequest>({name: '', /* … */})

watch(entity, current => {
  if (!current) return
  state.name = current.name          // copy field by field — the entity may have extra fields
}, {immediate: true})

function onSubmit(event: FormSubmitEvent<UpdateRequest>) {
  mutate(event.data, {onSuccess: () => useToast().add({title: 'Saved', color: 'success'})})
}
```

```ts
// queries/{domain}.ts — the endpoint returns the updated entity, so write it straight into the cache
export function useUpdateDomain() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateRequest) => updateDomain(data).then(r => r.data),
    onSuccess: updated => queryClient.setQueryData(['{domain}'], updated),
  })
}
```

### B) Data page — `useQuery` + pass props to presentational components

```vue
<template>
  <SomeView :data="data"/>
</template>

<script setup lang="ts">
import {useDomain} from '../../../queries/{domain}'
import SomeView from './SomeView.vue'   // feature-owned, colocated in the feature folder

const {data} = useDomain()        // page orchestrates; child is presentational
</script>
```

### C) Query hook (`queries/{domain}.ts`) and schema (`schemas/{domain}.ts`)

```ts
import {useQuery} from '@tanstack/vue-query'
import {getDomain} from '../api/{domain}'

export function useDomain() {
    return useQuery({queryKey: ['{domain}'], queryFn: () => getDomain().then(r => r.data)})
}
```

```ts
import {z} from 'zod'
export const someSchema = z.object({username: z.string().min(1, 'Username is required')})
```

### D) Presentational component

```vue
<script setup lang="ts">
import type {Domain} from '../../../types/{domain}'
defineProps<{ data: Domain | undefined }>()
</script>
```

### E) Test (Vitest + the `mountWithPlugins` helper)

```ts
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import MyPage from './MyPage.vue'
import * as domainApi from '../../../api/{domain}'
import {mountWithPlugins} from '../../../test/mountWithPlugins'

beforeEach(() => vi.restoreAllMocks())

it('calls the api with the form data', async () => {
    const spy = vi.spyOn(domainApi, 'someAction').mockResolvedValue({data: {}} as any)
    const wrapper = mountWithPlugins(MyPage)
    await wrapper.find('#username').setValue('admin')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    expect(spy).toHaveBeenCalledWith({username: 'admin'})
})
```

- `mountWithPlugins` installs router + Pinia + Nuxt UI + VueQuery (retries off).
- Need to spy navigation or read a store? Pass your own: `mountWithPlugins(MyPage, {router, pinia})`
  with `createTestRouter()` + `createPinia()` + `setActivePinia(pinia)` (see `pages/front/login/LoginPage.test.ts`).
- Always `await flushPromises()` after a submit (mutation/query resolve on a microtask).
- Overlays (dropdowns, toasts) **teleport into `<body>`** — query `document.body`
  (e.g. `[role="menuitem"]`) and clear it in `afterEach` (see `pages/front/components/Navbar.test.ts`). Opening a
  Reka-based dropdown needs `trigger('pointerdown')` + `trigger('click')`.
- `UIcon` renders an `<svg>`; a loading `UButton` sets `disabled`.

**What earns a test** (full rules in `AGENTS.md` → *Frontend Testing Strategy*):

- This page-level test **is** the default layer — one per page with logic, asserting visible
  behaviour and the payload sent to `api/*`.
- Don't add a separate test for the presentational components the page renders; this one
  covers them.
- Don't assert copy or the mere existence of a static element. If the only way a test can fail
  is a wording change, it doesn't earn its place.
- A placeholder page needs no test — `router.test.ts` already proves the route resolves to it.

---

## Checklist

- [ ] Page in `pages/{front|backoffice}/{feature}/{Name}Page.vue`; route in `router/index.ts`
      (+ `meta.layout: 'admin'` for backoffice; + case in `router.test.ts`)
- [ ] Server data via TanStack Query (`queries/{domain}.ts`); client state via Pinia only
- [ ] Forms via `UForm` + Zod schema (`schemas/{domain}.ts`) with a `reactive` state
- [ ] New components are presentational (props/emits, no fetching)
- [ ] `api/{domain}.ts` + `types/{domain}.ts` for any new endpoint
- [ ] Test with `mountWithPlugins`; api spied with `vi.spyOn`
- [ ] `npm run type-check` and `npm run test` green

## Hard rules

- Presentational components never call `api/*`, `useQuery`/`useMutation`, nor fetch.
- Server data lives in TanStack Query, **not** in Pinia.
- Every HTTP call goes through `api/*.ts` over `client` — never raw `axios` in a page.
- Destructure TanStack Query return values.
