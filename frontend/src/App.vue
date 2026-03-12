<template>
  <div class="layout">
    <header class="topbar">
      <div class="brand-block">
        <h1>Clínica Inteligente</h1>
        <p>Sistema de Atendimento Inteligente</p>
      </div>

      <nav class="topnav" v-if="user">
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link v-if="canAccessAdmin" to="/admin">Admin</router-link>
        <button @click="logout">Sair</button>
      </nav>

      <nav class="topnav" v-else>
        <router-link to="/login">Entrar</router-link>
        <router-link to="/cadastro">Criar conta</router-link>
      </nav>
    </header>

    <main class="container">
      <router-view @logged="refreshUser" />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const canAccessAdmin = computed(() => ['admin', 'secretary'].includes(user.value?.role))

function refreshUser() {
  user.value = JSON.parse(localStorage.getItem('user') || 'null')
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  refreshUser()
  router.push('/login')
}

watch(() => route.fullPath, refreshUser)
</script>
