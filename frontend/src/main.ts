import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {VueQueryPlugin} from '@tanstack/vue-query'
import ui from '@nuxt/ui/vue-plugin'
import router from './router'
import './index.css'
import App from './App.vue'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueQueryPlugin)
  .use(ui)
  .mount('#root')
