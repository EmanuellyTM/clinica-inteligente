const { validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    message: 'Dados inválidos enviados para a API.',
    errors: result.array().map((err) => ({
      field: err.path,
      message: err.msg
    }))
  });
}

module.exports = {
  handleValidationErrors
};