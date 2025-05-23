<template>
  <div class="container mt-5" style="max-width: 400px">
    <h2 class="mb-4">Iniciar sesión</h2>

    <div class="form-group mb-3">
      <label for="correo">Correo electrónico</label>
      <input type="email" class="form-control" id="correo" v-model="correo" placeholder="ejemplo@correo.com" />
    </div>

    <div class="form-group mb-4">
      <label for="contrasena">Contraseña</label>
      <input type="password" class="form-control" id="contrasena" v-model="contrasena" placeholder="********" />
    </div>

    <button class="btn btn-primary w-100" @click="iniciarSesion">
      Entrar
    </button>

    <button class="btn btn-outline-secondary w-100 mt-2" @click="irARegistro">
      ¿No tienes cuenta? Regístrate aquí
    </button>

    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE } from '../config'

const correo = ref('')
const contrasena = ref('')
const error = ref('')
const router = useRouter()
const irARegistro = () => {
  router.push('/registro')
}

const iniciarSesion = async () => {
  error.value = ''

  if (!correo.value || !contrasena.value) {
    error.value = 'Por favor, completa todos los campos.'
    return
  }

  try {
    const response = await fetch(
      `${API_BASE}/usuarios/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: correo.value,
          contrasena: contrasena.value
        })
      }
    )
    

     const data = await response.json()

    if (!response.ok || data.estado !== 1) {
      throw new Error(data.mensaje || 'Error al iniciar sesión')
    }

    const usuario = data.usuario

    // Guardamos datos en localStorage
    localStorage.setItem('token', usuario.claveApi)
    localStorage.setItem('nombre', usuario.nombre)
    localStorage.setItem('correo', usuario.correo)
    localStorage.setItem('idUsuario', usuario.id)

    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message
  }
}

</script>
