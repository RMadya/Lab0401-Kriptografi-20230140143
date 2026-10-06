require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

if (isProd && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET wajib diisi di production');
}

module.exports = {
  appName: 'MetaAuth',
  port: Number(process.env.PORT) || 3000,
  isProd,
  sessionSecret: process.env.SESSION_SECRET || 'dev-only-secret-change-me',
  challengeTtlMs: 5 * 60 * 1000, // nonce valid 5 menit
};
