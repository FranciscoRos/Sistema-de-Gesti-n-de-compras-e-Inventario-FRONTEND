<template>
  <Header />
  <div class="container-fluid">
    <div class="row">
      <!-- Main content -->
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom 1875rem">
          <h1 class="h2">Gestion de Reportes</h1>
        </div>

        <!-- Cards -->
          <div class="row text-center justify-content-center">
          <div class="col-md-3 mb-4">
            <div class="card text-white bg-primary">
              <div class="card-body">
                <h5 class="card-title">Tickets de Compra</h5>
                <p class="card-text">Gestiona tus tickets de compra</p>
                <a  id="ticket" href="#" class="btn btn-light" @click="descargarTickets" >Descargar</a>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card text-white bg-success">
              <div class="card-body">
                <h5 class="card-title">Stock</h5>
                <p class="card-text">Control de tu stock de productos</p>
                <a id="stock" href="#" class="btn btn-light" @click="consultaStock">Descargar</a>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="card text-white bg-warning">
              <div class="card-body">
                <h5 class="card-title">Proveedores</h5>
                <p class="card-text">Gestión de proveedores</p>
                <a id="proveedores" href="#" class="btn btn-light" @click="descargarProveedores">Descargar</a>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from '../components/Header.vue'
import { API_BASE } from '../config'

const token = localStorage.getItem('token') || ''

const consultaStock = async () => {
  try {
    const res = await fetch(`${API_BASE}/reportes/stock`, {
      headers: { Authorization: token }
    })
    
    if (!res.ok) {
      throw new Error('Error al descargar el reporte')
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tu stock.pdf'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error:', error)
    alert('Error al descargar el reporte')
  }
}

const descargarProveedores = async () => {
  try {
    const res = await fetch(`${API_BASE}/reportes/proveedor`, {
      headers: { Authorization: token }
    })
    
    if (!res.ok) {
      throw new Error('Error al descargar el reporte')
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Proveedores.pdf'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error:', error)
    alert('Error al descargar el reporte')
  }
}

const descargarTickets = async () => {
  try {
    const res = await fetch(`${API_BASE}/reportes/ticket`, {
      headers: { Authorization: token }
    })
    
    if (!res.ok) {
      throw new Error('Error al descargar el reporte')
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ticket de compra.pdf'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error:', error)
    alert('Error al descargar el reporte')
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 48px 0 0;
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
  padding: 0.5rem 1rem;
}

.sidebar .nav-link.active {
  color: #2470dc;
}

.sidebar .nav-link:hover {
  color: #2470dc;
}

.sidebar .nav-link i {
  margin-right: 0.5rem;
}

main {
  margin-top: 48px;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
