<template>
  <section class="card">
    <h3>Novo agendamento</h3>

    <form class="grid" @submit.prevent="submit">
      <select v-model="selectedDoctorIndex" @change="handleDoctorChange" required>
        <option value="" disabled>Selecione o médico</option>
        <option
          v-for="(doctor, index) in doctors"
          :key="doctor.name"
          :value="index"
        >
          {{ doctor.name }}
        </option>
      </select>

      <input
        v-model="form.specialty"
        placeholder="Especialidade"
        readonly
        required
      />

      <input
        v-model="form.date"
        type="datetime-local"
        required
        @change="checkAvailability"
      />

      <div>
        <input
          v-model="form.cep"
          placeholder="CEP"
          @blur="lookupCep"
          required
        />
        <small v-if="addressPreview">{{ addressPreview }}</small>
      </div>

      <button :disabled="isCheckingAvailability || !isSlotAvailable">
        {{ isCheckingAvailability ? 'Verificando...' : 'Agendar' }}
      </button>
    </form>

    <p v-if="availabilityMessage" :class="availabilityClass">
      {{ availabilityMessage }}
    </p>

    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import api from '../services/api';

const emit = defineEmits(['saved']);

const doctors = [
  { name: 'Dr. Marcelo Azevedo', specialty: 'Cardiologia' },
  { name: 'Dra. Helena Martins', specialty: 'Dermatologia' },
  { name: 'Dr. Ricardo Nogueira', specialty: 'Ortopedia' },
  { name: 'Dra. Camila Freitas', specialty: 'Pediatria' },
  { name: 'Dr. Fernando Lima', specialty: 'Neurologia' },
  { name: 'Dra. Juliana Castro', specialty: 'Ginecologia' },
  { name: 'Dr. Eduardo Ribeiro', specialty: 'Clínica Geral' },
  { name: 'Dra. Patrícia Moura', specialty: 'Endocrinologia' }
];

const selectedDoctorIndex = ref('');
const error = ref('');
const message = ref('');
const address = ref(null);

const availabilityMessage = ref('');
const isSlotAvailable = ref(false);
const isCheckingAvailability = ref(false);

const form = reactive({
  doctorName: '',
  specialty: '',
  date: '',
  cep: ''
});

const addressPreview = computed(() => {
  if (!address.value) return '';
  return `${address.value.street}, ${address.value.neighborhood} - ${address.value.city}/${address.value.state}`;
});

const availabilityClass = computed(() => {
  return isSlotAvailable.value ? 'success' : 'error';
});

function resetAvailabilityState() {
  availabilityMessage.value = '';
  isSlotAvailable.value = false;
}

function handleDoctorChange() {
  const doctor = doctors[selectedDoctorIndex.value];

  if (!doctor) {
    form.doctorName = '';
    form.specialty = '';
    resetAvailabilityState();
    return;
  }

  form.doctorName = doctor.name;
  form.specialty = doctor.specialty;

  if (form.date) {
    checkAvailability();
  }
}

async function lookupCep() {
  if (!form.cep) return;

  try {
    const { data } = await api.get(`/integrations/cep/${form.cep}`);
    address.value = data;
  } catch (err) {
    address.value = null;
    error.value =
      err.response?.data?.message || 'Não foi possível localizar o CEP informado.';
  }
}

async function checkAvailability() {
  if (!form.doctorName || !form.date) {
    resetAvailabilityState();
    return;
  }

  isCheckingAvailability.value = true;
  availabilityMessage.value = '';
  error.value = '';

  try {
    const { data } = await api.get('/appointments/availability', {
      params: {
        doctorName: form.doctorName,
        date: form.date
      }
    });

    isSlotAvailable.value = data.available;
    availabilityMessage.value = data.message;
  } catch (err) {
    isSlotAvailable.value = false;
    availabilityMessage.value =
      err.response?.data?.message || 'Erro ao verificar disponibilidade.';
  } finally {
    isCheckingAvailability.value = false;
  }
}

function validateFormBeforeSubmit() {
  if (!form.doctorName) {
    error.value = 'Selecione um médico.';
    return false;
  }

  if (!form.specialty) {
    error.value = 'A especialidade não foi preenchida.';
    return false;
  }

  if (!form.date) {
    error.value = 'Selecione a data e o horário.';
    return false;
  }

  if (!form.cep) {
    error.value = 'Informe o CEP.';
    return false;
  }

  if (!isSlotAvailable.value) {
    error.value = 'Escolha um horário disponível antes de agendar.';
    return false;
  }

  return true;
}

async function submit() {
  error.value = '';
  message.value = '';

  if (!validateFormBeforeSubmit()) {
    return;
  }

  try {
    await api.post('/appointments', {
      doctorName: form.doctorName,
      specialty: form.specialty,
      date: form.date,
      cep: form.cep
    });

    message.value = 'Agendamento criado com sucesso.';

    selectedDoctorIndex.value = '';
    form.doctorName = '';
    form.specialty = '';
    form.date = '';
    form.cep = '';
    address.value = null;
    availabilityMessage.value = '';
    isSlotAvailable.value = false;

    emit('saved');
  } catch (err) {
    console.error('Erro ao criar agendamento:', err.response?.data || err);

    if (err.response?.data?.errors?.length) {
      error.value = err.response.data.errors.map((item) => item.message).join(' | ');
      return;
    }

    error.value =
      err.response?.data?.message || 'Erro ao criar agendamento.';
  }
}
</script>