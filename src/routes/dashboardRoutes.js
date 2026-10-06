const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.get('/dashboard', requireAuth, DashboardController.index);
router.get('/transfer', requireAuth, DashboardController.transfer);

module.exports = router;
