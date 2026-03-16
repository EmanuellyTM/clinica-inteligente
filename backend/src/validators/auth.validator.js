const { body } = require('express-validator');

const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Nome deve ter entre 2 e 80 caracteres.'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('E-mail inválido.')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('A senha deve ter entre 6 e 128 caracteres.'),

  body('role')
    .optional()
    .isIn(['patient', 'secretary'])
    .withMessage('Perfil inválido.')
];

const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('E-mail inválido.')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Senha inválida.')
];

module.exports = {
  registerValidator,
  loginValidator
};