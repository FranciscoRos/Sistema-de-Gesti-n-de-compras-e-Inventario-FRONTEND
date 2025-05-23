<template>
  <Header />
<!-- 🔘 BOTÓN PARA IR A REGISTRAR UNA NUEVA COMPRA (alineado a la derecha con padding) -->
<div class="d-flex justify-content-end pt-3 mb-3 pe-4">
  <button class="btn btn-primary" @click="irANuevaCompra">
    Registrar nueva compra
  </button>
</div>


  <div class="container mt-5 pt-4">
    <h2 class="mb-4">Historial de Compras</h2>

    <!-- ▶️ LISTA DE COMPRAS CON ACORDEÓN -->
    <div v-for="compra in compras" :key="compra.idCompra" class="card mb-3 shadow">
      <!-- 🟢 CABECERA CLICKEABLE PARA MOSTRAR DETALLES -->
      <div class="card-header d-flex justify-content-between align-items-center" @click="toggleDetalle(compra.idCompra)"
        style="cursor: pointer">
        <div>
          <strong>ID:</strong> {{ compra.idCompra }} |
          <strong>Fecha:</strong> {{ formatearFecha(compra.fecha) }} |
          <strong>Total:</strong> ${{ Number(compra.total).toFixed(2) }}
        </div>
        <i class="bi" :class="{
          'bi-chevron-down': !detallesVisibles[compra.idCompra],
          'bi-chevron-up': detallesVisibles[compra.idCompra],
        }"></i>
      </div>

      <!-- 🔽 DETALLE DE COMPRA (SE EXPANDE CUANDO SE CLICKEA) -->
      <div v-if="detallesVisibles[compra.idCompra]" class="card-body bg-light">
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
            <tr v-for="item in detalles[compra.idCompra]" :key="item.idProducto">
              <td>{{ item.producto }}</td>
              <td>{{ item.cantidad }}</td>
              <td>${{ Number(item.precioUnitario).toFixed(2) }}</td>
              <td>${{ Number(item.subtotal).toFixed(2) }}</td>
            </tr>

          </tbody>
        </table>

        <div v-if="!detalles[compra.idCompra]?.length" class="text-muted">
          Esta compra no tiene productos registrados.
        </div>
      </div>
    </div>

    <!-- ⚠️ MENSAJE SI NO HAY COMPRAS -->
    <div v-if="compras.length === 0" class="alert alert-info">
      No hay compras registradas aún.
    </div>
  </div>
</template>

<script lang="ts" setup>
// 📦 IMPORTACIONES
import Header from '../components/Header.vue'
import { ref, onMounted } from 'vue'
import { API_BASE } from '../config'
import { useRouter } from 'vue-router'

// 🧾 TIPOS DE DATOS
interface Compra {
  idCompra: number
  fecha: string
  total: number
}

interface Detalle {
  idProducto: number
  producto: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

// 📁 VARIABLES REACTIVAS
const compras = ref<Compra[]>([])
const detalles = ref<Record<number, Detalle[]>>({})
const detallesVisibles = ref<Record<number, boolean>>({})

// 🔐 TOKEN DEL USUARIO
const token = localStorage.getItem('token')

// 🔄 CARGAR COMPRAS
const cargarCompras = async () => {
  try {
    const response = await fetch(`${API_BASE}/compras/`, {
      method: 'GET',
      headers: {
        Authorization: token ?? '',
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    if (data.estado === 1 && Array.isArray(data.datos)) {
      compras.value = data.datos
    } else {
      console.error('Error al obtener compras:', data.mensaje)
    }
  } catch (err) {
    console.error('Error al cargar compras:', err)
  }
}

// 🔽 TOGGLE DETALLE DE COMPRA
const toggleDetalle = async (idCompra: number) => {
  detallesVisibles.value[idCompra] = !detallesVisibles.value[idCompra]

  if (detallesVisibles.value[idCompra] && !detalles.value[idCompra]) {
    await cargarDetalle(idCompra)
  }
}

// 📦 CARGAR DETALLE DE UNA COMPRA
const cargarDetalle = async (idCompra: number) => {
  try {
    const response = await fetch(`${API_BASE}/detalleCompras/${idCompra}`, {
      method: 'GET',
      headers: {
        Authorization: token ?? '',
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    if (data.estado === 1) {
      detalles.value[idCompra] = data.datos
    } else {
      console.error('Error al obtener detalle de compra:', data.mensaje)
    }
  } catch (err) {
    console.error('Error al cargar detalle de compra:', err)
  }
}

// 📆 FORMATEAR FECHA
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

const router = useRouter()

const irANuevaCompra = () => {
  router.push('/compras/nueva')
}


</script>

<style scoped>
.card-header:hover {
  background-color: #f8f9fa;
}
</style>
