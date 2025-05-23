<template>
  <Header />

  <div class="container mt-5 pt-4">
    <h2 class="mb-4">Gestión de proveedores</h2>

    <!-- Formulario de nuevo proveedor o edición -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">
          {{ modoEdicion ? 'Editar proveedor' : 'Registrar nuevo proveedor' }}
        </h5>

        <div class="row g-3">
          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Nombre" v-model="formulario.nombre" />
          </div>

          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Contacto" v-model="formulario.contacto" />
          </div>

          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Teléfono" v-model="formulario.telefono" />
          </div>

          <div class="col-12">
            <button class="btn btn-success w-100" @click="modoEdicion ? actualizarProveedor() : registrarProveedor()">
              {{ modoEdicion ? 'Actualizar proveedor' : 'Guardar proveedor' }}
            </button>
          </div>

          <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
          <div v-if="exito" class="alert alert-success mt-3">{{ exito }}</div>
        </div>
      </div>
    </div>

    <!-- Tabla de proveedores registrados -->
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
            <button class="btn btn-warning btn-sm" @click="editarProveedor(proveedor)">Editar</button>
          </td>
          <td>
            <button class="btn btn-danger btn-sm" @click="confirmarEliminacion(proveedor.idProveedor)">Eliminar</button>
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
const error = ref('')
const exito = ref('')
const modoEdicion = ref(false)
const idEdicion = ref<number | null>(null)

const formulario = ref({ nombre: '', contacto: '', telefono: '' })
const token = localStorage.getItem('token') || ''

const cargarProveedores = async () => {
  try {
    const res = await fetch(`${API_BASE}/proveedores/`, {
      headers: { Authorization: token }
    })
    const data = await res.json()
    if (data.estado === 1) proveedores.value = data.datos
  } catch (e) {
    error.value = 'Error al cargar proveedores'
  }
}

const registrarProveedor = async () => {
  error.value = ''
  exito.value = ''
  if (!formulario.value.nombre || !formulario.value.contacto || !formulario.value.telefono) {
    error.value = 'Completa todos los campos.'
    return
  }
  try {
    const res = await fetch(`${API_BASE}/proveedores/`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formulario.value)
    })
    const data = await res.json()
    if (data.estado === 1) {
      exito.value = 'Proveedor registrado correctamente.'
      formulario.value = { nombre: '', contacto: '', telefono: '' }
      await cargarProveedores()
    } else {
      throw new Error(data.mensaje)
    }
  } catch (err: any) {
    error.value = err.message || 'Error inesperado'
  }
}

const editarProveedor = (proveedor: any) => {
  modoEdicion.value = true
  idEdicion.value = proveedor.idProveedor
  formulario.value = { ...proveedor }
  exito.value = ''
  error.value = ''
}

const actualizarProveedor = async () => {
  if (!idEdicion.value) return
  try {
    const res = await fetch(`${API_BASE}/proveedores/${idEdicion.value}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formulario.value)
    })
    const data = await res.json()
    if (data.estado === 1) {
      exito.value = 'Proveedor actualizado correctamente.'
      modoEdicion.value = false
      formulario.value = { nombre: '', contacto: '', telefono: '' }
      idEdicion.value = null
      await cargarProveedores()
    } else {
      throw new Error(data.mensaje)
    }
  } catch (err: any) {
    error.value = err.message || 'Error al actualizar proveedor'
  }
}

const confirmarEliminacion = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este proveedor?')) return
  try {
    const res = await fetch(`${API_BASE}/proveedores/${id}`, {
      method: 'DELETE',
      headers: { Authorization: token }
    })
    const data = await res.json()
    if (data.estado === 1) {
      exito.value = 'Proveedor eliminado correctamente.'
      await cargarProveedores()
    } else {
      throw new Error(data.mensaje)
    }
  } catch (err: any) {
    error.value = err.message || 'Error al eliminar proveedor'
  }
}

onMounted(() => {
  cargarProveedores()
})
</script>
