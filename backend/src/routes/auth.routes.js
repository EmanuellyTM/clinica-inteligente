const router = require('express').Router();
const { register, login, me } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../middlewares/validate.middleware');
const {
  registerValidator,
  loginValidator
} = require('../validators/auth.validator');

router.post('/register', registerValidator, handleValidationErrors, register);
router.post('/login', loginValidator, handleValidationErrors, login);
router.get('/me', protect, me);

module.exports = router;