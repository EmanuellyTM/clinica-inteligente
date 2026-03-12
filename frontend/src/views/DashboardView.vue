<template>
  <section>
    <div class="hero">
      <div>
        <h2>Olá, {{ user?.name }}</h2>
        <p>
          Gerencie suas consultas, consulte o endereço pelo CEP e visualize
          alerta de chuva.
        </p>
      </div>
    </div>

    <AppointmentForm @saved="fetchAppointments" />

    <AppointmentsTable
      :appointments="appointments"
      @refresh="fetchAppointments"
      @remove="removeAppointment"
    />

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
import AppointmentForm from '../components/AppointmentForm.vue'
import AppointmentsTable from '../components/AppointmentsTable.vue'

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const appointments = ref([])
const error = ref('')

function getPatientId(item) {
  if (!item?.patient) return null

  if (typeof item.patient === 'string') {
    return item.patient
  }

  return item.patient._id || item.patient.id || null
}

async function fetchAppointments() {
  error.value = ''

  try {
    const { data } = await api.get('/appointments')

    const currentUserId = user.value?.id || user.value?._id || null

    appointments.value = data.filter((item) => {
      const patientId = getPatientId(item)
      return patientId === currentUserId
    })
  } catch (err) {
    error.value =
      err.response?.data?.message || 'Erro ao carregar agendamentos'
  }
}

async function removeAppointment(id) {
  try {
    await api.delete(`/appointments/${id}`)
    await fetchAppointments()
  } catch (err) {
    error.value =
      err.response?.data?.message || 'Erro ao excluir agendamento'
  }
}

onMounted(fetchAppointments)
</script>