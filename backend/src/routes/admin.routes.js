const router = require('express').Router();
const { dashboard, deleteUser } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/dashboard', protect, authorize('admin', 'secretary'), dashboard);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;