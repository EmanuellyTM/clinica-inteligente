<template><section><div class="grid stats" v-if="data"><div class="card stat"><strong>{{ data.usersCount }}</strong><span>Usuários</span></div><div class="card stat"><strong>{{ data.appointmentsCount }}</strong><span>Agendamentos</span></div></div><section class="card" v-if="data"><h3>Próximos agendamentos</h3><ul><li v-for="item in data.nextAppointments" :key="item._id">{{ new Date(item.date).toLocaleString('pt-BR') }} — {{ item.patient?.name }} com {{ item.doctorName }}</li></ul></section><section class="card" v-if="data"><h3>Usuários recentes</h3><div class="table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th></tr></thead><tbody><tr v-for="user in data.users" :key="user._id"><td>{{ user.name }}</td><td>{{ user.email }}</td><td>{{ user.role }}</td></tr></tbody></table></div></section><p v-if="error" class="error">{{ error }}</p></section></template>
<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
const data = ref(null); const error = ref('')
async function fetchDashboard() { try { const response = await api.get('/admin/dashboard'); data.value = response.data } catch (err) { error.value = err.response?.data?.message || 'Erro ao carregar painel administrativo' } }
onMounted(fetchDashboard)
</script>
