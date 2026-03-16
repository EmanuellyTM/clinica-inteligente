const User = require('../models/User');
const Appointment = require('../models/Appointment');

async function dashboard(req, res) {
  const [
    usersCount,
    appointmentsCount,
    nextAppointments,
    users,
    pendingSecretaries
  ] = await Promise.all([
    User.countDocuments(),
    Appointment.countDocuments(),
    Appointment.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(10)
      .populate('patient', 'name email'),
    User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50),
    User.find({ role: 'secretary', approved: false })
      .select('-password')
      .sort({ createdAt: -1 })
  ]);

  res.json({
    usersCount,
    appointmentsCount,
    nextAppointments,
    users,
    pendingSecretaries
  });
}

async function approveSecretary(req, res) {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: 'Usuário não encontrado.'
    });
  }

  if (user.role !== 'secretary') {
    return res.status(400).json({
      message: 'Apenas usuários do tipo secretário podem ser aprovados.'
    });
  }

  if (user.approved) {
    return res.status(400).json({
      message: 'Este secretário já foi aprovado.'
    });
  }

  user.approved = true;
  await user.save();

  res.json({
    message: 'Secretário aprovado com sucesso.',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      approved: user.approved
    }
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
  approveSecretary,
  deleteUser
};