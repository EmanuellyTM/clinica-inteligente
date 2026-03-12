const router = require('express').Router();
const { addressByCep, rainForecast } = require('../controllers/integration.controller');
const { protect } = require('../middlewares/auth.middleware');
router.get('/cep/:cep', protect, addressByCep);
router.get('/weather', protect, rainForecast);
module.exports = router;
