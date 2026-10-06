const isApi = (req) => req.xhr || (req.headers.accept || '').includes('application/json');

/** Halaman yang butuh login. */
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  if (isApi(req)) return res.status(401).json({ error: 'Belum login' });
  return res.redirect('/login');
}

/** Halaman khusus tamu (login). Kalo udah login, lempar ke dashboard. */
function guestOnly(req, res, next) {
  if (req.session && req.session.user) return res.redirect('/dashboard');
  return next();
}

module.exports = { requireAuth, guestOnly };
