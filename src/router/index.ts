// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// IMPORTEN AQUI SUS COMPONENTES COMO PAGINAS  
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProductosView from '../views/ProductosView.vue'
import ProveedoresView from '../views/ProveedoresView.vue'
import ComprasView from '../views/ComprasView.vue'
import CrearCompraView from '../views/CrearCompraView.vue'
import ReportesView from '../views/ReportesView.vue'



// PONGAN LAS RUTAS Y EL COMPONENTE QUE QUIEREN QUE SE CARGUE EN CADA RUTA

const routes = [
  { path: '/', component: LoginView },
  { path: '/dashboard', component: DashboardView },
  { path: '/registro', component: RegisterView },
  { path: '/inventario', component: ProductosView },
  { path: '/proveedores', component: ProveedoresView },
  { path: '/compras', component: ComprasView },
  { path: '/compras/nueva', component: CrearCompraView },
  { path: '/reportes', component: ReportesView }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router