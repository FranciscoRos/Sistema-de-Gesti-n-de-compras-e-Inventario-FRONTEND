<template>
  <Header />

  <div class="container mt-5 pt-4">
    <h2 class="text-center mb-5">Menú principal</h2>

    <div class="row justify-content-center g-4">
      <div class="col-md-6 col-lg-4" v-for="tarjeta in tarjetas" :key="tarjeta.titulo">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">{{ tarjeta.titulo }}</h5>
              <p class="card-text text-muted">{{ tarjeta.descripcion }}</p>
            </div>
            <button class="btn btn-primary mt-3 w-100" @click="router.push(tarjeta.ruta)">
              Ir a {{ tarjeta.titulo.toLowerCase() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tarjetas = [
  {
    titulo: 'Productos',
    descripcion: 'Gestiona el inventario de productos',
    ruta: '/productos'
  },
  {
    titulo: 'Compras',
    descripcion: 'Consulta y administra las compras registradas',
    ruta: '/compras'
  },
  {
    titulo: 'Registrar compra',
    descripcion: 'Crea una nueva compra al proveedor',
    ruta: '/compras/nueva'
  },
  {
    titulo: 'Proveedores',
    descripcion: 'Administra la lista de proveedores',
    ruta: '/proveedores'
  },
  {
    titulo: 'Reportes',
    descripcion: 'Consulta los reportes de tu inventario y compras',
    ruta: '/reportes'
  }
]
</script>
