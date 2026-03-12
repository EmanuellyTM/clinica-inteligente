<template>
  <section class="card auth-card">
    <h2>Criar conta</h2>
    <form @submit.prevent="submit">
      <input v-model="form.name" type="text" placeholder="Nome" required />
      <input v-model="form.email" type="email" placeholder="E-mail" required />
      <input v-model="form.password" type="password" placeholder="Senha (mínimo 6)" required />
      <select v-model="form.role">
        <option value="patient">Paciente</option>
        <option value="secretary">Secretário(a)</option>
      </select>
      <button>Cadastrar</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <router-link to="/login">Já tenho conta</router-link>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const error = ref('')
const form = reactive({ name: '', email: '', password: '', role: 'patient' })

async function submit() {
  error.value = ''
  try {
    await api.post('/auth/register', form)
    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao cadastrar'
  }
}
</script>