<template>
  <Header />
  <div class="container mt-5 pt-4">
    <h2 class="mb-4">Gestión de inventario de productos</h2>

  
    <button class="btn btn-success mb-3" @click="mostrarFormulario = !mostrarFormulario">
      {{ mostrarFormulario ? 'Cancelar' : 'Agregar producto al inventario' }}
    </button>

    <!-- Formulario nuevo producto -->
    <div v-if="mostrarFormulario" class="card p-4 mb-4 border">
      <div class="row g-3">
        <div class="col-md-3">
          <input type="text" class="form-control" placeholder="Nombre" v-model="nuevoProducto.nombre" />
        </div>
        <div class="col-md-3">
          <input type="number" class="form-control" placeholder="Precio compra" v-model="nuevoProducto.precioCompra" />
        </div>
        <div class="col-md-3">
          <input type="number" class="form-control" placeholder="Precio venta" v-model="nuevoProducto.precioVenta" />
        </div>
        <div class="col-md-3">
          <input type="number" class="form-control" placeholder="Stock" v-model="nuevoProducto.stock" />
        </div>
        <div class="col-12 mt-3">
          <button class="btn btn-primary w-100" @click="guardarProducto">
            Guardar producto
          </button>
        </div>
        <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
        <div v-if="exito" class="alert alert-success mt-2">{{ exito }}</div>
      </div>
    </div>

    <!-- Tabla de productos -->
    <table class="table table-striped table-hover align-middle" v-if="productos.length">
      <thead class="table-dark">
        <tr>
          <th>Producto</th>
          <th>Precio compra</th>
          <th>Precio venta</th>
          <th>Stock</th>
          <th>Editar</th>
          
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.idProducto">
          <td>{{ producto.nombre }}</td>
          <td>${{ parseFloat(producto.precioCompra).toFixed(2) }}</td>
          <td>${{ parseFloat(producto.precioVenta).toFixed(2) }}</td>
          <td>{{ producto.stock }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editarProducto(producto)">Editar</button>
          </td>
          <!-- <td>
            <button class="btn btn-danger btn-sm" @click="eliminarProducto(producto.idProducto)">Eliminar</button>
          </td> -->
        </tr>
      </tbody>
    </table>

    <div v-else class="alert alert-info">Cargando productos o ninguno disponible...</div>
  </div>
  <!-- Formulario para editar producto -->
<div v-if="productoEditar" class="card mt-4">
  <div class="card-body">
    <h5 class="card-title">Editar producto</h5>
    <div class="row g-3">
      <div class="col-md-3">
        <input v-model="productoEditar.nombre" class="form-control" placeholder="Nombre" />
      </div>
      <div class="col-md-3">
        <input v-model.number="productoEditar.precioCompra" type="number" step="0.01" class="form-control" placeholder="Precio compra" />
      </div>
      <div class="col-md-3">
        <input v-model.number="productoEditar.precioVenta" type="number" step="0.01" class="form-control" placeholder="Precio venta" />
      </div>
      <div class="col-md-3">
        <input v-model.number="productoEditar.stock" type="number" class="form-control" placeholder="Stock" />
      </div>
      <div class="col-12 mt-3">
        <button class="btn btn-primary" @click="guardarEdicion">Guardar cambios</button>
        <button class="btn btn-secondary ms-2" @click="cancelarEdicion">Cancelar</button>
      </div>
    </div>
  </div>
</div>

</template>


<script lang="ts" setup>
import Header from '../components/Header.vue'
import { ref, onMounted } from 'vue'
import { API_BASE } from '../config'


const productos = ref<any[]>([])
const mostrarFormulario = ref(false)

const nuevoProducto = ref({
  nombre: '',
  precioCompra: '',
  precioVenta: '',
  stock: ''
})

const error = ref('')
const exito = ref('')

// Cargar productos
const cargarProductos = async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${API_BASE}/productos/`, {
      method: 'GET',
      headers: {
        Authorization: token,
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
}

// Guardar producto
const guardarProducto = async () => {
  error.value = ''
  exito.value = ''

  const token = localStorage.getItem('token')
  if (!token) {
    error.value = 'Token no encontrado.'
    return
  }

  const { nombre, precioCompra, precioVenta, stock } = nuevoProducto.value

  if (!nombre || !precioCompra || !precioVenta || !stock) {
    error.value = 'Todos los campos son obligatorios.'
    return
  }

  try {
    const response = await fetch(`${API_BASE}/productos/`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre,
        precioCompra,
        precioVenta,
        stock
      })
    })

    const data = await response.json()

    if (!response.ok || data.estado !== 1) {
      throw new Error(data.mensaje || 'Error al registrar producto')
    }

    exito.value = 'Producto registrado correctamente.'
    nuevoProducto.value = { nombre: '', precioCompra: '', precioVenta: '', stock: '' }
    mostrarFormulario.value = false
    await cargarProductos()
  } catch (err: any) {
    error.value = err.message || 'Error al registrar producto'
  }
}



//Seccion de edicion
const productoEditar = ref<any | null>(null)

const editarProducto = (producto: any) => {
  productoEditar.value = { ...producto } // copia temporal
}

const cancelarEdicion = () => {
  productoEditar.value = null
}

const guardarEdicion = async () => {
  if (!productoEditar.value) return

  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const response = await fetch(`${API_BASE}/productos/${productoEditar.value.idProducto}`, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: productoEditar.value.nombre,
        precioCompra: productoEditar.value.precioCompra,
        precioVenta: productoEditar.value.precioVenta,
        stock: productoEditar.value.stock
      })
    })

    const data = await response.json()
    if (!response.ok || data.estado !== 1) {
      console.error('Error al editar producto:', data)
      return
    }

    // Recargar productos y cerrar formulario
    await cargarProductos()
    productoEditar.value = null
  } catch (err) {
    console.error('Error al guardar edición:', err)
  }
}



onMounted(cargarProductos)
</script>

