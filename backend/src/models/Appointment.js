const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  specialty: { type: String, required: true },
  date: { type: Date, required: true },
  cep: { type: String, required: true },
  address: { street: String, neighborhood: String, city: String, state: String },
  weatherAlert: { checkedAt: Date, hasRain: Boolean, summary: String }
}, { timestamps: true });
module.exports = mongoose.model('Appointment', appointmentSchema);
