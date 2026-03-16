const router = require('express').Router();
const {
  checkAvailability,
  createAppointment,
  listAppointments,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointment.controller');
const { protect } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../middlewares/validate.middleware');
const {
  createAppointmentValidator,
  updateAppointmentValidator,
  availabilityValidator,
  mongoIdParamValidator
} = require('../validators/appointment.validator');

router.use(protect);

router.get('/', listAppointments);
router.get('/availability', availabilityValidator, handleValidationErrors, checkAvailability);
router.post('/', createAppointmentValidator, handleValidationErrors, createAppointment);
router.put('/:id', mongoIdParamValidator, updateAppointmentValidator, handleValidationErrors, updateAppointment);
router.delete('/:id', mongoIdParamValidator, handleValidationErrors, deleteAppointment);

module.exports = router;