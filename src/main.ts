
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // EL ROUTER OARA GESTIONAR LAS RUTAS

import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

createApp(App).use(router).mount('#app')
