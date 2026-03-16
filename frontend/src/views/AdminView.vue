<template>
  <section>
    <div class="hero admin-hero">
      <div>
        <h2>Painel administrativo</h2>
        <p>Visão geral do sistema, aprovações pendentes, usuários e agendamentos.</p>
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

    <section class="card" v-if="data?.pendingSecretaries?.length">
      <div class="row space-between wrap-row">
        <h3>Secretários pendentes de aprovação</h3>
        <span class="muted-text">{{ data.pendingSecretaries.length }} pendente(s)</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="userItem in data.pendingSecretaries" :key="userItem._id">
              <td>{{ userItem.name }}</td>
              <td>{{ userItem.email }}</td>
              <td>{{ userItem.role }}</td>
              <td>
                <span class="badge warning">Pendente</span>
              </td>
              <td class="actions-cell">
                <button @click="approveUser(userItem)">Aprovar</button>
                <button class="danger" @click="removeUser(userItem)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="grid admin-grid">
      <section class="card" v-if="data">
        <div class="row space-between wrap-row">
          <h3>Próximos agendamentos</h3>
          <button @click="refreshAll">Atualizar</button>
        </div>

        <ul class="clean-list" v-if="data.nextAppointments?.length">
          <li
            v-for="item in data.nextAppointments"
            :key="item._id"
            class="list-card"
          >
            <strong class="appointment-date">
              {{ new Date(item.date).toLocaleString('pt-BR') }}
            </strong>

            <p class="appointment-main">
              {{ item.patient?.name || 'Paciente não informado' }} com {{ item.doctorName }}
            </p>

            <small class="appointment-specialty">
              {{ item.specialty }}
            </small>
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
          <li>Secretários só entram após aprovação do administrador.</li>
          <li>Usuários com perfil <code>admin</code> acessam aprovações e exclusões.</li>
        </ul>
      </section>
    </div>

    <section class="card" v-if="appointments.length">
      <div class="row space-between wrap-row">
        <h3>Todos os agendamentos</h3>
        <span class="muted-text">{{ appointments.length }} registro(s)</span>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Especialidade</th>
              <th>Data</th>
              <th>Endereço</th>
              <th>Alerta de chuva</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in appointments" :key="item._id">
              <td>{{ item.patient?.name || '-' }}</td>
              <td>{{ item.doctorName }}</td>
              <td>{{ item.specialty }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ formatAddress(item.address) }}</td>
              <td>
                <span
                  :class="item.weatherAlert?.hasRain ? 'badge warning' : 'badge success'"
                >
                  {{ item.weatherAlert?.summary || 'Sem dados' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card" v-else>
      <h3>Todos os agendamentos</h3>

      <div class="empty-state">
        <strong>Nenhum agendamento encontrado.</strong>
        <p>Assim que usuários criarem consultas, os registros aparecerão aqui.</p>
      </div>
    </section>

    <section class="card" v-if="data">
      <div class="row space-between wrap-row">
        <h3>Usuários recentes</h3>
        <span class="muted-text">{{ data.users?.length || 0 }} usuário(s)</span>
      </div>

      <div class="table-wrap" v-if="data.users?.length">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="userItem in data.users" :key="userItem._id">
              <td>{{ userItem.name }}</td>
              <td>{{ userItem.email }}</td>
              <td>{{ userItem.role }}</td>
              <td>
                <span
                  :class="userItem.approved ? 'badge success' : 'badge warning'"
                >
                  {{ userItem.approved ? 'Aprovado' : 'Pendente' }}
                </span>
              </td>
              <td>
                <button
                  v-if="canDeleteUser(userItem)"
                  class="danger"
                  @click="removeUser(userItem)"
                >
                  Excluir
                </button>
                <span v-else class="muted-text">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <strong>Nenhum usuário encontrado.</strong>
        <p>Assim que novos cadastros forem realizados, eles aparecerão nesta tabela.</p>
      </div>
    </section>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import api from '../services/api';

const data = ref(null);
const appointments = ref([]);
const error = ref('');
const success = ref('');

const loggedUser = ref(JSON.parse(localStorage.getItem('user') || 'null'));

const nextAppointmentsCount = computed(() => {
  return data.value?.nextAppointments?.length || 0;
});

async function fetchDashboard() {
  const response = await api.get('/admin/dashboard');
  data.value = response.data;
}

async function fetchAppointments() {
  const response = await api.get('/appointments');
  appointments.value = response.data;
}

async function refreshAll() {
  error.value = '';
  success.value = '';

  try {
    await Promise.all([fetchDashboard(), fetchAppointments()]);
  } catch (err) {
    error.value =
      err.response?.data?.message || 'Erro ao carregar painel administrativo';
  }
}

function formatDate(date) {
  return new Date(date).toLocaleString('pt-BR');
}

function formatAddress(address) {
  if (!address) return '-';

  return `${address.street || ''}, ${address.neighborhood || ''} - ${address.city || ''}/${address.state || ''}`;
}

function canDeleteUser(userItem) {
  const currentUserId = loggedUser.value?.id || loggedUser.value?._id;
  return String(userItem._id) !== String(currentUserId);
}

async function approveUser(userItem) {
  error.value = '';
  success.value = '';

  try {
    await api.patch(`/admin/users/${userItem._id}/approve`);
    success.value = `Secretário ${userItem.name} aprovado com sucesso.`;
    await refreshAll();
  } catch (err) {
    error.value =
      err.response?.data?.message || 'Erro ao aprovar secretário.';
  }
}

async function removeUser(userItem) {
  const confirmed = window.confirm(
    `Tem certeza que deseja excluir o cadastro de ${userItem.name}? Essa ação também removerá os agendamentos desse usuário.`
  );

  if (!confirmed) return;

  error.value = '';
  success.value = '';

  try {
    await api.delete(`/admin/users/${userItem._id}`);
    success.value = 'Usuário removido com sucesso.';
    await refreshAll();
  } catch (err) {
    error.value =
      err.response?.data?.message || 'Erro ao excluir usuário.';
  }
}

onMounted(refreshAll);
</script>