<template>
  <Header />

  <div class="container mt-5 pt-4">
    <h2 class="mb-4">Historial de Compras</h2>

    <div
      v-for="compra in compras"
      :key="compra.idCompra"
      class="card mb-3 shadow"
    >
      <div
        class="card-header d-flex justify-content-between align-items-center"
        @click="toggleDetalle(compra.idCompra)"
        style="cursor: pointer"
      >
        <div>
          <strong>ID:</strong> {{ compra.idCompra }} |
          <strong>Fecha:</strong> {{ formatearFecha(compra.fecha) }} |
          <strong>Total:</strong> ${{ compra.total.toFixed(2) }}
        </div>
        <span>
          <i
            class="bi"
            :class="{
              'bi-chevron-down': !detallesVisibles[compra.idCompra],
              'bi-chevron-up': detallesVisibles[compra.idCompra],
            }"
          ></i>
        </span>
      </div>

      <div
        v-if="detallesVisibles[compra.idCompra]"
        class="card-body bg-light"
      >
        <p class="fw-bold">Detalle de productos:</p>

        <table class="table table-sm table-bordered table-hover">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in detalles[compra.idCompra]"
              :key="item.idProducto"
            >
              <td>{{ item.nombre }}</td>
              <td>{{ item.cantidad }}</td>
              <td>${{ item.precioUnitario.toFixed(2) }}</td>
              <td>${{ item.subtotal.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="!detalles[compra.idCompra]?.length" class="text-muted">
          Esta compra no tiene productos registrados.
        </div>
      </div>
    </div>

    <div v-if="compras.length === 0" class="alert alert-info">
      No hay compras registradas aún.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { API_BASE } from '../config'
import Header from '../components/Header.vue'

interface Compra {
  idCompra: number
  fecha: string
  total: number
}

interface Detalle {
  idProducto: number
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

const compras = ref<Compra[]>([])
const detalles = ref<Record<number, Detalle[]>>({})
const detallesVisibles = ref<Record<number, boolean>>({})

const token = localStorage.getItem('token')

const cargarCompras = async () => {
  console.log(token);
  try {
    const response = await fetch(`${API_BASE}/compras/`, {
      method: 'GET',
      headers: {
        Authorization: token ?? '',
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    if (data.estado === 1) {
      compras.value = data.datos
    } else {
      console.error('Error al obtener compras:', data.mensaje)
    }
  } catch (err) {
    console.error('Error al cargar compras:', err)
  }
}

const cargarDetalle = async (idCompra: number) => {
  try {
    const response = await fetch(`${API_BASE}/compras/${idCompra}/detalle`, {
      method: 'GET',
      headers: {
        Authorization: token ?? '',
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    if (data.estado === 1) {
      detalles.value[idCompra] = data.detalles
    } else {
      console.error('Error al obtener detalle de compra:', data.mensaje)
    }
  } catch (err) {
    console.error('Error al cargar detalle de compra:', err)
  }
}

const toggleDetalle = async (idCompra: number) => {
  detallesVisibles.value[idCompra] = !detallesVisibles.value[idCompra]

  // Si se va a mostrar y aún no se ha cargado, entonces cargarlo
  if (detallesVisibles.value[idCompra] && !detalles.value[idCompra]) {
    await cargarDetalle(idCompra)
  }
}

const formatearFecha = (fecha: string): string => {
  const d = new Date(fecha)
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  cargarCompras()
})
</script>

<style scoped>
.card-header:hover {
  background-color: #f8f9fa;
}
</style>
