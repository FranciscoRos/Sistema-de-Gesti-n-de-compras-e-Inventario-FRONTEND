<template>
  <Header />
  <div class="container mt-5 pt-4">
    <h2 class="mb-4">Gestión de productos</h2>

    <!-- Tabla de productos -->
    <table class="table table-striped table-hover align-middle" v-if="productos.length">
      <thead class="table-dark">
        <tr>
          <th>Producto</th>
          <th>Precio compra</th>
          <th>Precio venta</th>
          <th>Stock</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.idProducto">
          <td>{{ producto.nombre }}</td>
          <td>${{ parseFloat(producto.precioCompra).toFixed(2) }}</td>
          <td>${{ parseFloat(producto.precioVenta).toFixed(2) }}</td>
          <td>{{ producto.stock }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editarProducto(producto)">
              Editar
            </button>
          </td>
          <td>
            <button class="btn btn-danger btn-sm" @click="eliminarProducto(producto.idProducto)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="alert alert-info">
      Cargando productos o ninguno disponible...
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue'
import { ref, onMounted } from 'vue'
import { API_BASE } from '../config'

const productos = ref<any[]>([])

const editarProducto = (producto: any) => {
  console.log('Editar producto:', producto)
}

const eliminarProducto = (id: number) => {
  console.log('Eliminar producto con ID:', id)
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${API_BASE}/productos/`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok || data.estado !== 1 || !Array.isArray(data.datos)) {
      console.error('Error en la respuesta:', data)
      return
    }

    productos.value = data.datos
  } catch (err) {
    console.error('Error al cargar productos:', err)
  }
})
</script>
