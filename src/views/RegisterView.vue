<template>
  <div class="container mt-5" style="max-width: 500px">
    <h2 class="mb-4">Registro de nuevo usuario</h2>

    <div class="form-group mb-3">
      <label for="nombre">Nombre</label>
      <input type="text" class="form-control" id="nombre" v-model="nombre" placeholder="Tu nombre completo" />
    </div>

    <div class="form-group mb-3">
      <label for="correo">Correo electrónico</label>
      <input type="email" class="form-control" id="correo" v-model="correo" placeholder="ejemplo@correo.com" />
    </div>

    <div class="form-group mb-3">
      <label for="contrasena">Contraseña</label>
      <input type="password" class="form-control" id="contrasena" v-model="contrasena"
        placeholder="Mínimo 6 caracteres" />
    </div>

    <div class="form-group mb-4">
      <label for="confirmar">Confirmar contraseña</label>
      <input type="password" class="form-control" id="confirmar" v-model="confirmar"
        placeholder="Repite la contraseña" />
    </div>

    <button class="btn btn-success w-100" @click="registrarUsuario">
      Crear cuenta
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

const nombre = ref('')
const correo = ref('')
const contrasena = ref('')
const confirmar = ref('')
const error = ref('')
const router = useRouter()
const registrarUsuario = async () => {
  error.value = ''

  if (!nombre.value || !correo.value || !contrasena.value || !confirmar.value) {
    error.value = 'Todos los campos son obligatorios.'
    return
  }

  if (contrasena.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  if (contrasena.value !== confirmar.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }


  try {
    const response = await fetch(
      `${API_BASE}/usuarios/registro`,
      {
        method: 'POST',
        headers: {
          
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: correo.value,
          contrasena: contrasena.value,
          nombre: nombre.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok || data.estado !== 1) {
      throw new Error(data.mensaje || 'Error al iniciar sesión')
    }

    

    localStorage.setItem('token', data.claveApi)
    //localStorage.setItem('nombre', nombre.value)
    //localStorage.setItem('correo', usuario.correo)
    //localStorage.setItem('idUsuario', usuario.id)

    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Error al registrar'

  }
}

</script>
