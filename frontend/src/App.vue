<template>
  <div class="layout">
    <header class="topbar">
      <div><h1>Clínica Inteligente</h1><p>Sistema de Atendimento Inteligente</p></div>
      <nav>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link v-if="canAccessAdmin" to="/admin">Admin</router-link>
        <button v-if="user" @click="logout">Sair</button>
      </nav>
    </header>
    <main class="container"><router-view @logged="refreshUser" /></main>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const canAccessAdmin = computed(() => ['admin', 'secretary'].includes(user.value?.role))
function refreshUser() { user.value = JSON.parse(localStorage.getItem('user') || 'null') }
function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); refreshUser(); router.push('/login') }
</script>
