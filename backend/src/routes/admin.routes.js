const router = require('express').Router();
const {
  dashboard,
  approveSecretary,
  deleteUser
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/dashboard', protect, authorize('admin', 'secretary'), dashboard);
router.patch('/users/:id/approve', protect, authorize('admin'), approveSecretary);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;