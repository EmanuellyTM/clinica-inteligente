const User = require('../models/User');
const Appointment = require('../models/Appointment');
async function dashboard(req, res) {
  const [usersCount, appointmentsCount, nextAppointments, users] = await Promise.all([
    User.countDocuments(),
    Appointment.countDocuments(),
    Appointment.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(10).populate('patient', 'name email'),
    User.find().select('-password').sort({ createdAt: -1 }).limit(20)
  ]);
  res.json({ usersCount, appointmentsCount, nextAppointments, users });
}
module.exports = { dashboard };
