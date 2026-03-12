<template>
  <section>
    <div class="hero admin-hero">
      <div>
        <h2>Painel administrativo</h2>
        <p>Visão geral do sistema, próximos atendimentos e usuários cadastrados.</p>
      </div>
    </div>

    <div class="grid stats" v-if="data">
      <div class="card stat">
        <strong>{{ data.usersCount }}</strong>
        <span>Usuários</span>
      </div>
      <div class="card stat">
        <strong>{{ data.appointmentsCount }}</strong>
        <span>Agendamentos</span>
      </div>
      <div class="card stat">
        <strong>{{ nextAppointmentsCount }}</strong>
        <span>Próximos atendimentos</span>
      </div>
    </div>

    <div class="grid admin-grid">
      <section class="card" v-if="data">
        <div class="row space-between wrap-row">
          <h3>Próximos agendamentos</h3>
          <button @click="fetchDashboard">Atualizar</button>
        </div>

        <ul class="clean-list" v-if="data.nextAppointments?.length">
          <li v-for="item in data.nextAppointments" :key="item._id" class="list-card">
            <strong>{{ new Date(item.date).toLocaleString('pt-BR') }}</strong>
            <span>{{ item.patient?.name || 'Paciente não informado' }} com {{ item.doctorName }}</span>
            <small>{{ item.specialty }}</small>
          </li>
        </ul>

        <div v-else class="empty-state">
          <strong>Nenhum atendimento futuro encontrado.</strong>
          <p>Quando novos agendamentos forem criados, eles aparecerão aqui.</p>
        </div>
      </section>

      <section class="card admin-side" v-if="data">
        <h3>Resumo rápido</h3>
        <ul class="clean-list summary-list">
          <li>Pacientes e equipe podem acessar o sistema com autenticação JWT.</li>
          <li>Consultas podem trazer endereço por CEP e alerta de chuva.</li>
          <li>Usuários com perfil <code>admin</code> ou <code>secretary</code> acessam este painel.</li>
        </ul>
      </section>
    </div>

    <section class="card" v-if="data">
      <h3>Usuários recentes</h3>

      <div class="table-wrap" v-if="data.users?.length">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in data.users" :key="user._id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <strong>Nenhum usuário encontrado.</strong>
        <p>Assim que novos cadastros forem realizados, eles aparecerão nesta tabela.</p>
      </div>
    </section>

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../services/api'

const data = ref(null)
const error = ref('')
const nextAppointmentsCount = computed(() => data.value?.nextAppointments?.length || 0)

async function fetchDashboard() {
  error.value = ''
  try {
    const response = await api.get('/admin/dashboard')
    data.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao carregar painel administrativo'
  }
}

onMounted(fetchDashboard)
</script>
