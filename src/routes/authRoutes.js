const express = require('express');
const rateLimit = require('express-rate-limit');
const AuthController = require('../controllers/authController');
const { guestOnly, requireAuth } = require('../middlewares/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Kebanyakan request, tunggu bentar' },
});

router.get('/login', guestOnly, AuthController.showLogin);
router.post('/auth/challenge', authLimiter, guestOnly, AuthController.issueChallenge);
router.post('/auth/verify', authLimiter, guestOnly, AuthController.verifyLogin);
router.post('/auth/logout', requireAuth, AuthController.logout);

module.exports = router;
