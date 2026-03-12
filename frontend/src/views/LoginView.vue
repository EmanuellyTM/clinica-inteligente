<template>
  <section class="card auth-card">
    <h2>Entrar</h2>

    <form @submit.prevent="submit">
      <input
        v-model="form.email"
        type="email"
        placeholder="E-mail"
        required
      />

      <input
        v-model="form.password"
        type="password"
        placeholder="Senha"
        required
      />

      <button>Entrar</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <router-link to="/cadastro">Criar conta</router-link>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const emit = defineEmits(['logged'])
const error = ref('')

const form = reactive({
  email: '',
  password: ''
})

async function submit() {
  error.value = ''

  try {
    const { data } = await api.post('/auth/login', form)

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    emit('logged')
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao fazer login'
  }
}
</script>