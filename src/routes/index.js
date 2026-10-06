const express = require('express');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.get('/', (req, res) => res.redirect('/dashboard'));
router.use(authRoutes);
router.use(dashboardRoutes);

module.exports = router;
