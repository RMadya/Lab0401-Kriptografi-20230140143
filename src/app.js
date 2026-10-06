const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
if (config.isProd) app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Static: css/js sendiri + ethers (UMD build) langsung dari node_modules
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
  '/vendor/ethers.js',
  express.static(path.join(__dirname, '..', 'node_modules', 'ethers', 'dist', 'ethers.umd.min.js'))
);

// NOTE: MemoryStore cuma buat dev. Di production ganti (connect-redis, dll).
app.use(
  session({
    name: 'connect.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProd,
      maxAge: 1000 * 60 * 60 * 8, // 8 jam
    },
  })
);

// Variabel global buat semua view
app.use((req, res, next) => {
  res.locals.appName = config.appName;
  res.locals.user = req.session.user || null;
  res.locals.active = '';
  next();
});

app.use(routes);

// 404
app.use((req, res) => {
  res.status(404).render('error', { title: '404', code: 404, message: 'Halaman ga ketemu' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: '500', code: 500, message: 'Ada yang error di server' });
});

module.exports = app;
