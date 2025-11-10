import './assets/main.css'
import 'vue-final-modal/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import "./app.service"

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVfm())
app.use(Vue3Toasity, {
  autoClose: 1000,
  clearOnUrlChange: false
})

app.mount('#lasaaClient')
