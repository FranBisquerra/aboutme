# /new-page — Create a New Frontend Page

Standard recipe for adding a page to the Vue 3 frontend. The stack is fixed:

- **PrimeVue** — UI components (theme Aura, dark mode via `.dark`). Coexists with Tailwind 4.
- **@primevue/forms + Zod** — form state + validation.
- **TanStack Query** (`@tanstack/vue-query`) — server state (loading/error/cache) over the axios `api/*`.
- **Pinia** — client state only (e.g. the auth token). Not for server data.
- **axios** (`api/client.ts`) — transport. Wrapped by TanStack Query, never called raw in a page.

## Folder structure & naming

```
frontend/src/
├── pages/{Name}Page.vue        ← route-level SMART component (orchestrates data + actions)
├── components/{Name}.vue       ← PRESENTATIONAL component (props in / emits out, no fetching)
├── router/index.ts             ← register { path, component } (+ case in router.test.ts)
├── api/{domain}.ts             ← thin axios functions ( client.get/post<T> )
├── types/{domain}.ts           ← TS interfaces mirroring the backend DTOs
├── schemas/{domain}.ts         ← Zod schemas (form validation, mirror backend validation)
├── queries/{domain}.ts         ← TanStack Query hooks ( useQuery / useMutation wrappers )
├── stores/{domain}.ts          ← Pinia store — CLIENT state only (token, UI)
└── test/mountWithPlugins.ts    ← test helper (mounts with router+pinia+PrimeVue+VueQuery)
```

## Rules

1. **Server data → TanStack Query.** Reads = `useQuery`, writes/actions = `useMutation`, both
   wrapping the `api/*.ts` axios fn. They give `data / isPending / isError / isSuccess`. Never
   hand-roll a loading/error state machine, and don't keep server data in Pinia.
2. **Client state → Pinia.** Only things that aren't server data (auth token + persistence, UI flags).
3. **Page (smart) vs component (presentational).** The page calls the query/mutation and passes
   data **down as props**. Components receive props / emit events — no `useQuery`, no `api/*`,
   no `onMounted` fetch.
4. **Forms → `@primevue/forms` + Zod.** `<Form :resolver="zodResolver(schema)">`, PrimeVue inputs
   with a `name`, `Message` for per-field errors. Validation comes from the Zod schema.
5. **HTTP only through `api/*.ts`** (over `client`). Types in `types/*.ts`, never inline.

### ⚠️ Two gotchas (bit us already)
- **Destructure TanStack Query results** — its fields are refs; destructuring (`const {data, isPending} = useQuery(...)`) is the intended usage and lets templates auto-unwrap them. Using `q.isPending` in a template fails type-checking.
- **Give `<Form>` `:initial-values`** with empty strings for every field. Untouched fields are `null`, and `z.string()` fails with "expected string, received null" *before* your `.min(1, 'X is required')` message. `initialValues: { field: '' }` makes the custom messages show.

---

## Templates

### A) Form page — `@primevue/forms` + Zod + `useMutation` (login, contact, any write)

```vue
<template>
  <Form v-slot="$form" :resolver="resolver" :initial-values="initialValues" @submit="onFormSubmit">
    <InputText id="username" name="username" type="text" fluid/>
    <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">
      {{ $form.username.error?.message }}
    </Message>

    <Message v-if="isError" severity="error" size="small" variant="simple">Something went wrong.</Message>
    <Button type="submit" label="Submit" :loading="isPending"/>
  </Form>
</template>

<script setup lang="ts">
import {Form, type FormSubmitEvent} from '@primevue/forms'
import {zodResolver} from '@primevue/forms/resolvers/zod'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import {useMutation} from '@tanstack/vue-query'
import {someAction} from '../api/{domain}'
import {someSchema} from '../schemas/{domain}'
import type {SomeRequest} from '../types/{domain}'

const resolver = zodResolver(someSchema)
const initialValues = {username: ''}            // every field, empty string (gotcha above)

const {mutate, isPending, isError} = useMutation({
  mutationFn: (data: SomeRequest) => someAction(data),
  onSuccess: ({data}) => { /* store token, redirect, etc. */ },
})

function onFormSubmit({valid, values}: FormSubmitEvent) {
  if (valid) mutate(values as SomeRequest)
}
</script>
```

### B) Data page — `useQuery` + pass props to presentational components

```vue
<template>
  <SomeView :data="data"/>
</template>

<script setup lang="ts">
import {useDomain} from '../queries/{domain}'
import SomeView from '../components/SomeView.vue'

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
import type {Domain} from '../types/{domain}'
defineProps<{ data: Domain | undefined }>()
</script>
```

### E) Test (Vitest + the `mountWithPlugins` helper)

```ts
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {flushPromises} from '@vue/test-utils'
import MyPage from './MyPage.vue'
import * as domainApi from '../api/{domain}'
import {mountWithPlugins} from '../test/mountWithPlugins'

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

- `mountWithPlugins` installs router + Pinia + PrimeVue + VueQuery (retries off).
- Need to spy navigation or read a store? Pass your own: `mountWithPlugins(MyPage, {router, pinia})`
  with `createTestRouter()` + `createPinia()` + `setActivePinia(pinia)` (see `LoginPage.test.ts`).
- Always `await flushPromises()` after a submit (mutation/query resolve on a microtask).

---

## Checklist

- [ ] Page in `pages/{Name}Page.vue`; route in `router/index.ts` (+ case in `router.test.ts`)
- [ ] Server data via TanStack Query (`queries/{domain}.ts`); client state via Pinia only
- [ ] Forms via `@primevue/forms` + Zod schema (`schemas/{domain}.ts`) with `:initial-values`
- [ ] New components are presentational (props/emits, no fetching)
- [ ] `api/{domain}.ts` + `types/{domain}.ts` for any new endpoint
- [ ] Test with `mountWithPlugins`; api spied with `vi.spyOn`
- [ ] `npm run type-check` and `npm run test` green

## Hard rules

- Presentational components never call `api/*`, `useQuery`/`useMutation`, nor fetch.
- Server data lives in TanStack Query, **not** in Pinia.
- Every HTTP call goes through `api/*.ts` over `client` — never raw `axios` in a page.
- Destructure TanStack Query return values; give `<Form>` `:initial-values`.
