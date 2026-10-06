const AuthService = require('../services/authService');
const UserModel = require('../models/userModel');

const AuthController = {
  showLogin(req, res) {
    res.render('login', { title: 'Login' });
  },

  /** Step 1: client kirim address, server balikin message buat di-sign. */
  issueChallenge(req, res) {
    const { address } = req.body || {};
    if (!AuthService.isValidAddress(address)) {
      return res.status(400).json({ error: 'Address ga valid' });
    }

    const challenge = AuthService.createChallenge(address, req.get('host'));
    req.session.challenge = challenge;
    return res.json({ message: challenge.message });
  },

  /** Step 2: client kirim signature, server verifikasi lalu bikin session. */
  verifyLogin(req, res, next) {
    const { address, signature } = req.body || {};
    const challenge = req.session.challenge;

    if (!AuthService.isValidAddress(address) || typeof signature !== 'string') {
      return res.status(400).json({ error: 'Payload ga valid' });
    }
    if (AuthService.isChallengeExpired(challenge)) {
      return res.status(400).json({ error: 'Challenge kadaluarsa, coba login lagi' });
    }
    if (challenge.address.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).json({ error: 'Address beda dari yang request challenge' });
    }

    let verified;
    try {
      verified = AuthService.verifySignature({ message: challenge.message, signature, address });
    } catch (err) {
      return res.status(401).json({ error: 'Signature ga valid' });
    }

    const user = UserModel.upsertOnLogin(verified);

    // regenerate session biar aman dari session fixation (challenge ikut kebuang = sekali pakai)
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.user = {
        address: user.address,
        publicKey: user.publicKey,
        compressedPublicKey: user.compressedPublicKey,
      };
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        return res.json({ ok: true, redirect: '/dashboard' });
      });
    });
  },

  logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  },
};

module.exports = AuthController;
