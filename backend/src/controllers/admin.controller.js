const User = require('../models/User');
const Appointment = require('../models/Appointment');

async function dashboard(req, res) {
  const [usersCount, appointmentsCount, nextAppointments, users] = await Promise.all([
    User.countDocuments(),
    Appointment.countDocuments(),
    Appointment.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(10)
      .populate('patient', 'name email'),
    User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50)
  ]);

  res.json({
    usersCount,
    appointmentsCount,
    nextAppointments,
    users
  });
}

async function deleteUser(req, res) {
  const { id } = req.params;

  if (String(req.user._id) === String(id)) {
    return res.status(400).json({
      message: 'Você não pode excluir sua própria conta.'
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: 'Usuário não encontrado.'
    });
  }

  await Appointment.deleteMany({ patient: user._id });
  await user.deleteOne();

  res.json({
    message: 'Usuário e seus agendamentos foram removidos com sucesso.'
  });
}

module.exports = {
  dashboard,
  deleteUser
};