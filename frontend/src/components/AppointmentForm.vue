<template><section class="card"><h3>Novo agendamento</h3><form class="grid" @submit.prevent="submit"><input v-model="form.doctorName" placeholder="Nome do médico" required /><input v-model="form.specialty" placeholder="Especialidade" required /><input v-model="form.date" type="datetime-local" required /><div><input v-model="form.cep" placeholder="CEP" @blur="lookupCep" required /><small v-if="addressPreview">{{ addressPreview }}</small></div><button>Agendar</button></form><p v-if="message" class="success">{{ message }}</p><p v-if="error" class="error">{{ error }}</p></section></template>
<script setup>
import { computed, reactive, ref } from 'vue'
import api from '../services/api'
const emit = defineEmits(['saved']); const form = reactive({ doctorName: '', specialty: '', date: '', cep: '' }); const error = ref(''); const message = ref(''); const address = ref(null)
const addressPreview = computed(() => address.value ? `${address.value.street}, ${address.value.neighborhood} - ${address.value.city}/${address.value.state}` : '')
async function lookupCep() { if (!form.cep) return; try { const { data } = await api.get(`/integrations/cep/${form.cep}`); address.value = data } catch { address.value = null } }
async function submit() { error.value=''; message.value=''; try { await api.post('/appointments', form); message.value='Agendamento criado com sucesso.'; form.doctorName=''; form.specialty=''; form.date=''; form.cep=''; address.value=null; emit('saved') } catch (err) { error.value = err.response?.data?.message || 'Erro ao criar agendamento' } }
</script>
