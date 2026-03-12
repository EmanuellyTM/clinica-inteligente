const Appointment = require('../models/Appointment');
const { getAddressByCep } = require('../services/cep.service');
const { getRainForecastForDate } = require('../services/weather.service');
async function ensureScheduleAvailability({ doctorName, date, ignoreId = null }) {
  const when = new Date(date);
  const start = new Date(when); start.setMinutes(0, 0, 0);
  const end = new Date(start); end.setHours(end.getHours() + 1);
  const query = { doctorName, date: { $gte: start, $lt: end } };
  if (ignoreId) query._id = { $ne: ignoreId };
  const conflict = await Appointment.findOne(query);
  if (conflict) {
    const err = new Error('Já existe consulta agendada para este médico nesse horário aproximado de 1 hora.');
    err.status = 409;
    throw err;
  }
}
async function createAppointment(req, res) {
  const { doctorName, specialty, date, cep } = req.body;
  await ensureScheduleAvailability({ doctorName, date });
  const address = await getAddressByCep(cep);
  const weatherAlert = await getRainForecastForDate(address.city, address.state, date);
  const appointment = await Appointment.create({ patient: req.user._id, doctorName, specialty, date, cep, address, weatherAlert });
  res.status(201).json(appointment);
}
async function listAppointments(req, res) {
  const query = ['secretary', 'admin'].includes(req.user.role) ? {} : { patient: req.user._id };
  const appointments = await Appointment.find(query).populate('patient', 'name email role').sort({ date: 1 });
  res.json(appointments);
}
async function updateAppointment(req, res) {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado' });
  const isOwner = String(appointment.patient) === String(req.user._id);
  const elevated = ['secretary', 'admin'].includes(req.user.role);
  if (!isOwner && !elevated) return res.status(403).json({ message: 'Acesso negado' });
  const payload = { ...req.body };
  const doctorName = payload.doctorName || appointment.doctorName;
  const date = payload.date || appointment.date;
  if (payload.doctorName || payload.date) await ensureScheduleAvailability({ doctorName, date, ignoreId: req.params.id });
  if (payload.cep) {
    const address = await getAddressByCep(payload.cep);
    payload.address = address;
    payload.weatherAlert = await getRainForecastForDate(address.city, address.state, payload.date || appointment.date);
  } else if (payload.date) {
    payload.weatherAlert = await getRainForecastForDate(appointment.address.city, appointment.address.state, payload.date);
  }
  const updated = await Appointment.findByIdAndUpdate(req.params.id, payload, { new: true });
  res.json(updated);
}
async function deleteAppointment(req, res) {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Agendamento não encontrado' });
  const isOwner = String(appointment.patient) === String(req.user._id);
  const elevated = ['secretary', 'admin'].includes(req.user.role);
  if (!isOwner && !elevated) return res.status(403).json({ message: 'Acesso negado' });
  await appointment.deleteOne();
  res.json({ message: 'Agendamento removido com sucesso' });
}
module.exports = { createAppointment, listAppointments, updateAppointment, deleteAppointment };
