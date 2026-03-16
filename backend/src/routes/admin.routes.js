const router = require('express').Router();
const { dashboard, deleteUser } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../middlewares/validate.middleware');
const { mongoIdParamValidator } = require('../validators/appointment.validator');

router.get('/dashboard', protect, authorize('admin', 'secretary'), dashboard);
router.delete('/users/:id', protect, authorize('admin'), mongoIdParamValidator, handleValidationErrors, deleteUser);

module.exports = router;