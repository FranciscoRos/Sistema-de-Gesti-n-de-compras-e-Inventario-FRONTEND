// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// IMPORTEN AQUI SUS COMPONENTES COMO PAGINAS  
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import RegisterView from '../views/RegisterView.vue'
// PONGAN LAS RUTAS Y EL COMPONENTE QUE QUIEREN QUE SE CARGUE EN CADA RUTA

const routes = [
  {
    path: '/',
    component: LoginView
  },
  {
    path: '/dashboard',
    component: DashboardView
  },
  { path: '/registro', component: RegisterView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router