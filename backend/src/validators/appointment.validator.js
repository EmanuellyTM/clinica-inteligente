const { body, query, param } = require('express-validator');

const createAppointmentValidator = [
  body('doctorName')
    .trim()
    .notEmpty()
    .withMessage('Selecione um médico.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do médico inválido.'),

  body('specialty')
    .trim()
    .notEmpty()
    .withMessage('Especialidade obrigatória.')
    .isLength({ min: 2, max: 80 })
    .withMessage('Especialidade inválida.'),

  body('date')
    .notEmpty()
    .withMessage('Data obrigatória.')
    .isISO8601()
    .withMessage('Data inválida.')
    .custom((value) => {
      const d = new Date(value);

      if (Number.isNaN(d.getTime())) {
        throw new Error('Data inválida.');
      }

      if (d.getTime() < Date.now()) {
        throw new Error('A data do agendamento não pode estar no passado.');
      }

      return true;
    }),

  body('cep')
    .trim()
    .notEmpty()
    .withMessage('CEP obrigatório.')
    .matches(/^\\d{5}-?\\d{3}$/)
    .withMessage('CEP inválido.')
];

const updateAppointmentValidator = [
  body('doctorName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do médico inválido.'),

  body('specialty')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Especialidade inválida.'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Data inválida.')
    .custom((value) => {
      const d = new Date(value);

      if (Number.isNaN(d.getTime())) {
        throw new Error('Data inválida.');
      }

      if (d.getTime() < Date.now()) {
        throw new Error('A data do agendamento não pode estar no passado.');
      }

      return true;
    }),

  body('cep')
    .optional()
    .trim()
    .matches(/^\\d{5}-?\\d{3}$/)
    .withMessage('CEP inválido.')
];

const availabilityValidator = [
  query('doctorName')
    .trim()
    .notEmpty()
    .withMessage('Nome do médico obrigatório.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do médico inválido.'),

  query('date')
    .notEmpty()
    .withMessage('Data obrigatória.')
    .isISO8601()
    .withMessage('Data inválida.')
];

const mongoIdParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Identificador inválido.')
];

module.exports = {
  createAppointmentValidator,
  updateAppointmentValidator,
  availabilityValidator,
  mongoIdParamValidator
};