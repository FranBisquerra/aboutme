import {createApp} from 'vue'
import {createPinia} from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import {VueQueryPlugin} from '@tanstack/vue-query'
import router from './router'
import 'primeicons/primeicons.css'
import './index.css'
import App from './App.vue'

createApp(App)
    .use(createPinia())
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.dark',
                cssLayer: {
                    name: 'primevue',
                    order: 'theme, base, primevue',
                },
            },
        },
    })
    .use(VueQueryPlugin)
    .mount('#root')
