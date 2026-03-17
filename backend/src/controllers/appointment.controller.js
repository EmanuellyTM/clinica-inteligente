const Appointment = require('../models/Appointment');
const { getAddressByCep } = require('../services/cep.service');
const { getRainForecastForDate } = require('../services/weather.service');

function getOneHourWindow(date) {
  const when = new Date(date);

  if (Number.isNaN(when.getTime())) {
    const err = new Error('Data inválida.');
    err.status = 400;
    throw err;
  }

  const start = new Date(when);
  start.setMinutes(0, 0, 0);

  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return { start, end };
}

function normalizeCep(value) {
  return String(value || '').replace(/\D/g, '');
}

async function ensureScheduleAvailability({ doctorName, date, ignoreId = null }) {
  const { start, end } = getOneHourWindow(date);

  const query = {
    doctorName,
    date: {
      $gte: start,
      $lt: end
    }
  };

  if (ignoreId) {
    query._id = { $ne: ignoreId };
  }

  const conflict = await Appointment.findOne(query);

  if (conflict) {
    const err = new Error(
      'Já existe consulta agendada para este médico nesse horário aproximado de 1 hora.'
    );
    err.status = 409;
    throw err;
  }
}

async function checkAvailability(req, res) {
  const { doctorName, date } = req.query;

  if (!doctorName || !date) {
    return res.status(400).json({
      available: false,
      message: 'Informe o nome do médico e a data para verificar disponibilidade.'
    });
  }

  try {
    const { start, end } = getOneHourWindow(date);

    const conflict = await Appointment.findOne({
      doctorName,
      date: {
        $gte: start,
        $lt: end
      }
    }).populate('patient', 'name email');

    if (conflict) {
      return res.json({
        available: false,
        message: 'Horário indisponível para este médico.',
        conflictingAppointment: {
          id: conflict._id,
          patient: conflict.patient?.name || 'Paciente não identificado',
          date: conflict.date
        }
      });
    }

    return res.json({
      available: true,
      message: 'Horário disponível para agendamento.'
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      available: false,
      message: error.message || 'Erro ao verificar disponibilidade.'
    });
  }
}

async function createAppointment(req, res) {
  const { doctorName, specialty, date, cep } = req.body;

  await ensureScheduleAvailability({ doctorName, date });

  const normalizedCep = normalizeCep(cep);
  const address = await getAddressByCep(normalizedCep);
  const weatherAlert = await getRainForecastForDate(
    address.city,
    address.state,
    date
  );

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctorName,
    specialty,
    date,
    cep: normalizedCep,
    address,
    weatherAlert
  });

  res.status(201).json(appointment);
}

async function listAppointments(req, res) {
  const query = ['secretary', 'admin'].includes(req.user.role)
    ? {}
    : { patient: req.user._id };

  const appointments = await Appointment.find(query)
    .populate('patient', 'name email role')
    .sort({ date: 1 });

  res.json(appointments);
}

async function updateAppointment(req, res) {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      message: 'Agendamento não encontrado'
    });
  }

  const isOwner = String(appointment.patient) === String(req.user._id);
  const elevated = ['secretary', 'admin'].includes(req.user.role);

  if (!isOwner && !elevated) {
    return res.status(403).json({
      message: 'Acesso negado'
    });
  }

  const payload = { ...req.body };
  const doctorName = payload.doctorName || appointment.doctorName;
  const date = payload.date || appointment.date;

  if (payload.doctorName || payload.date) {
    await ensureScheduleAvailability({
      doctorName,
      date,
      ignoreId: req.params.id
    });
  }

  if (payload.cep) {
    const normalizedCep = normalizeCep(payload.cep);
    const address = await getAddressByCep(normalizedCep);

    payload.cep = normalizedCep;
    payload.address = address;
    payload.weatherAlert = await getRainForecastForDate(
      address.city,
      address.state,
      payload.date || appointment.date
    );
  } else if (payload.date) {
    payload.weatherAlert = await getRainForecastForDate(
      appointment.address.city,
      appointment.address.state,
      payload.date
    );
  }

  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    payload,
    { new: true }
  );

  res.json(updated);
}

async function deleteAppointment(req, res) {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      message: 'Agendamento não encontrado'
    });
  }

  const isOwner = String(appointment.patient) === String(req.user._id);
  const elevated = ['secretary', 'admin'].includes(req.user.role);

  if (!isOwner && !elevated) {
    return res.status(403).json({
      message: 'Acesso negado'
    });
  }

  await appointment.deleteOne();

  res.json({
    message: 'Agendamento removido com sucesso'
  });
}

module.exports = {
  checkAvailability,
  createAppointment,
  listAppointments,
  updateAppointment,
  deleteAppointment
};