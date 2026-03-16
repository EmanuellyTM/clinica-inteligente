const router = require('express').Router();
const {
  checkAvailability,
  createAppointment,
  listAppointments,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointment.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', listAppointments);
router.get('/availability', checkAvailability);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;