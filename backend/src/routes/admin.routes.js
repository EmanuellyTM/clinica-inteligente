const router = require('express').Router();
const { dashboard } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
router.get('/dashboard', protect, authorize('admin', 'secretary'), dashboard);
module.exports = router;
