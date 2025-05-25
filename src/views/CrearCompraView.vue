<template>
  <Header />

  <div class="container mt-5">
    <h2 class="mb-4">Registrar Nueva Compra</h2>

    <!-- Selector de proveedor -->
    <div class="mb-4">
      <label for="proveedor" class="form-label">Proveedor</label>
      <select class="form-select" v-model="idProveedor">
        <option disabled value="">Selecciona un proveedor</option>
        <option v-for="p in proveedores" :key="p.idProveedor" :value="p.idProveedor">
          {{ p.nombre }}
        </option>
      </select>
    </div>

    <!-- Agregar producto -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Añadir producto</h5>

        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label">Producto</label>
            <input
              class="form-control"
              list="lista-productos"
              v-model="productoSeleccionadoNombre"
              placeholder="Escribe o selecciona un producto"
            />
            <datalist id="lista-productos">
              <option v-for="prod in productos" :key="prod.idProducto" :value="prod.nombre" />
            </datalist>
          </div>

          <div class="col-md-3">
            <label class="form-label">Cantidad</label>
            <input type="number" class="form-control" v-model.number="cantidad" />
          </div>

          <div class="col-md-3">
            <label class="form-label">Precio unitario</label>
            <input type="number" step="0.01" class="form-control" v-model.number="precioUnitario" />
          </div>

          <div class="col-md-2">
            <button class="btn btn-success w-100" @click="agregarProducto">Agregar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de productos añadidos -->
    <div v-if="listaProductos.length > 0" class="mb-4">
      <h5>Productos añadidos</h5>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in listaProductos" :key="index">
            <td>{{ nombreProducto(item.idProducto) }}</td>
            <td>{{ item.cantidad }}</td>
            <td>${{ item.precioUnitario.toFixed(2) }}</td>
            <td>${{ (item.precioUnitario * item.cantidad).toFixed(2) }}</td>
            <td><button class="btn btn-danger btn-sm" @click="eliminarProducto(index)">Quitar</button></td>
          </tr>
        </tbody>
      </table>

      <div class="text-end fw-bold">
        Total: ${{ totalCompra.toFixed(2) }}
      </div>
    </div>

    <!-- Botón para registrar compra -->
    <button class="btn btn-primary w-100" @click="registrarCompra">Registrar compra</button>

    <div v-if="mensaje" class="alert alert-info mt-3">{{ mensaje }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { API_BASE } from '../config'
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = localStorage.getItem('token') || ''

const proveedores = ref<any[]>([])
const productos = ref<any[]>([])
const idProveedor = ref('')
const productoSeleccionadoNombre = ref('')
const cantidad = ref<number>(1)
const precioUnitario = ref<number>(0)
const listaProductos = ref<any[]>([])
const mensaje = ref('')

const totalCompra = computed(() =>
  listaProductos.value.reduce((total, p) => total + p.precioUnitario * p.cantidad, 0)
)

const cargarProveedores = async () => {
  const res = await fetch(`${API_BASE}/proveedores`, {
    headers: { Authorization: token }
  })
  const data = await res.json()
  if (data.estado === 1) proveedores.value = data.datos
}

const cargarProductos = async () => {
  const res = await fetch(`${API_BASE}/productos/`, {
    headers: { Authorization: token }
  })
  const data = await res.json()
  if (data.estado === 1) productos.value = data.datos
}

const nombreProducto = (id: number) => {
  const p = productos.value.find(p => p.idProducto === id)
  return p ? p.nombre : 'Desconocido'
}

const agregarProducto = async () => {
  if (!productoSeleccionadoNombre.value || cantidad.value <= 0 || precioUnitario.value <= 0) {
    mensaje.value = 'Completa los datos del producto correctamente.'
    return
  }

  let producto = productos.value.find(
    p => p.nombre.toLowerCase() === productoSeleccionadoNombre.value.toLowerCase()
  )

  if (!producto) {
    const res = await fetch(`${API_BASE}/productos/`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: productoSeleccionadoNombre.value,
        precioCompra: precioUnitario.value,
        precioVenta: precioUnitario.value * 1.5,
        stock: 0
      })
    })
    const data = await res.json()
    if (data.estado === 1) {
      await cargarProductos()
      producto = productos.value.find(p => p.idProducto === data.id)
    } else {
      mensaje.value = 'No se pudo registrar el nuevo producto.'
      return
    }
  }

  listaProductos.value.push({
    idProducto: producto.idProducto,
    cantidad: cantidad.value,
    precioUnitario: precioUnitario.value
  })

  productoSeleccionadoNombre.value = ''
  cantidad.value = 1
  precioUnitario.value = 0
  mensaje.value = ''
}

const eliminarProducto = (index: number) => {
  listaProductos.value.splice(index, 1)
}

const registrarCompra = async () => {
  if (!idProveedor.value || listaProductos.value.length === 0) {
    mensaje.value = 'Selecciona proveedor y añade productos.'
    return
  }

  try {
    const res = await fetch(`${API_BASE}/compras/`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idProveedor: idProveedor.value,
        productos: listaProductos.value
      })
    })

    const data = await res.json()
    if (data.estado === 1) {
      mensaje.value = 'Compra registrada correctamente.'
      setTimeout(() => router.push('/compras'), 1500)
    } else {
      mensaje.value = data.mensaje || 'Error al registrar compra.'
    }
  } catch (error) {
    mensaje.value = 'Error al conectar con el servidor.'
  }
}

onMounted(() => {
  cargarProveedores()
  cargarProductos()
})
</script>
