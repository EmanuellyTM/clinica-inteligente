<template><section><div class="hero"><div><h2>Olá, {{ user?.name }}</h2><p>Gerencie consultas, consulte o endereço pelo CEP e visualize alerta de chuva.</p></div></div><AppointmentForm @saved="fetchAppointments" /><AppointmentsTable :appointments="appointments" @refresh="fetchAppointments" @remove="removeAppointment" /><p v-if="error" class="error">{{ error }}</p></section></template>
<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
import AppointmentForm from '../components/AppointmentForm.vue'
import AppointmentsTable from '../components/AppointmentsTable.vue'
const user = ref(JSON.parse(localStorage.getItem('user') || 'null')); const appointments = ref([]); const error = ref('')
async function fetchAppointments() { error.value=''; try { const { data } = await api.get('/appointments'); appointments.value = data } catch (err) { error.value = err.response?.data?.message || 'Erro ao carregar agendamentos' } }
async function removeAppointment(id) { try { await api.delete(`/appointments/${id}`); await fetchAppointments() } catch (err) { error.value = err.response?.data?.message || 'Erro ao excluir agendamento' } }
onMounted(fetchAppointments)
</script>
