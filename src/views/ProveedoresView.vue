<template>
  <Header />
  <div class="container mt-5 pt-4">
    <h2 class="mb-4">Gestión de proveedores</h2>

    <!-- Botón para agregar un nuevo proveedor -->
     <!-- Formulario de nuevo proveedor -->
<div class="card mb-4">
  <div class="card-body">
    <h5 class="card-title">Registrar nuevo proveedor</h5>

    <div class="row g-3">
      <div class="col-md-4">
        <input
          type="text"
          class="form-control"
          placeholder="Nombre"
          v-model="nuevoProveedor.nombre"
        />
      </div>

      <div class="col-md-4">
        <input
          type="text"
          class="form-control"
          placeholder="Contacto"
          v-model="nuevoProveedor.contacto"
        />
      </div>

      <div class="col-md-4">
        <input
          type="text"
          class="form-control"
          placeholder="Teléfono"
          v-model="nuevoProveedor.telefono"
        />
      </div>

      <div class="col-12">
        <button class="btn btn-success w-100" @click="registrarProveedor">
          Guardar proveedor
        </button>
      </div>

      <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      <div v-if="exito" class="alert alert-success mt-3">{{ exito }}</div>
    </div>
  </div>
</div>


    <!-- Esta es la tabla dinamica -->
    <table class="table table-hover table-striped align-middle">
      <thead class="table-dark">
        <tr>
          <th>Nombre</th>
          <th>Contacto</th>
          <th>Teléfono</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proveedor in proveedores" :key="proveedor.idProveedor">
          <td>{{ proveedor.nombre }}</td>
          <td>{{ proveedor.contacto }}</td>
          <td>{{ proveedor.telefono }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editarProveedor(proveedor)">
              Editar
            </button>
          </td>
          <td>
            <button class="btn btn-danger btn-sm" @click="eliminarProveedor(proveedor.idProveedor)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="proveedores.length === 0" class="alert alert-info">
      No hay proveedores registrados aún.
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue'
import { ref, onMounted } from 'vue'
import { API_BASE } from '../config'


const proveedores = ref<any[]>([])

const nuevoProveedor = ref({
  nombre: '',
  contacto: '',
  telefono: ''
})

const error = ref('')
const exito = ref('')

const cargarProveedores = async () => {
  error.value = ''
  const token = localStorage.getItem('token')
  if (!token) {
    error.value = 'Token no encontrado.'
    return
  }

  try {
    const response = await fetch(
      `${API_BASE}/proveedores/`,
      {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    if (!response.ok || data.estado !== 1) {
      throw new Error(data.mensaje || 'Error al obtener proveedores')
    }

    proveedores.value = data.datos
  } catch (err: any) {
    error.value = err.message || 'Error al cargar proveedores'
  }
}

const registrarProveedor = async () => {
  error.value = ''
  exito.value = ''

  const { nombre, contacto, telefono } = nuevoProveedor.value

  if (!nombre || !contacto || !telefono) {
    error.value = 'Por favor, completa todos los campos.'
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    error.value = 'Token no encontrado.'
    return
  }

  try {
    const response = await fetch(
      `${API_BASE}/proveedores/`,
      {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProveedor.value)
      }
    )

    const data = await response.json()

    if (!response.ok || data.estado !== 1) {
      throw new Error(data.mensaje || 'Error al registrar proveedor')
    }

    exito.value = 'Proveedor registrado correctamente.'
    nuevoProveedor.value = { nombre: '', contacto: '', telefono: '' }

    await cargarProveedores()
  } catch (err: any) {
    error.value = err.message || 'Error inesperado'
  }
}

const editarProveedor = (proveedor: any) => {
  console.log('Editar proveedor:', proveedor)
}

const eliminarProveedor = (id: number) => {
  console.log('Eliminar proveedor con ID:', id)
}

onMounted(() => {
  cargarProveedores()
})
</script>

