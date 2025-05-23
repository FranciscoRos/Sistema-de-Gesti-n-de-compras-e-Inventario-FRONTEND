<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
    <a class="navbar-brand d-flex align-items-center" href="#" @click.prevent="irDashboard">
      <img src="./logo.png" alt="Logo" width="32" height="32" class="me-2" />
      Sistema de compras
    </a>

    <div class="ms-auto text-white">
      {{ nombre }} ({{ correo }})
      <button class="btn btn-sm btn-outline-light ms-3" @click="cerrarSesion">
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombre = ref('')
const correo = ref('')

onMounted(() => {
  nombre.value = localStorage.getItem('nombre') || ''
  correo.value = localStorage.getItem('correo') || ''
})

const irDashboard = () => {
  router.push('/dashboard')
}

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.navbar-brand {
  cursor: pointer;
}
</style>
