<template>
  <div class="layout">
    <header class="topbar">
      <div class="brand-block">
        <h1>Clínica Inteligente</h1>
        <p>Sistema de Atendimento Inteligente</p>
      </div>

      <nav class="topnav" v-if="isAuthenticated">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link v-if="canAccessAdmin" to="/admin">Admin</router-link>
        <button @click="logout">Sair</button>
      </nav>
    </header>

    <main class="container">
      <router-view @logged="refreshAuthState" />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const token = ref('')
const user = ref(null)

const isAuthenticated = computed(() => Boolean(token.value))
const canAccessAdmin = computed(() => isAuthenticated.value && ['admin', 'secretary'].includes(user.value?.role))

function refreshAuthState() {
  token.value = localStorage.getItem('token') || ''
  user.value = JSON.parse(localStorage.getItem('user') || 'null')
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  refreshAuthState()
  router.push('/login')
}

function handleStorage() {
  refreshAuthState()
}

onMounted(() => {
  refreshAuthState()
  window.addEventListener('storage', handleStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorage)
})
</script>
