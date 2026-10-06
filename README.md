# MetaAuth — MetaMask login (Express + EJS + Tailwind + ethers v6)

## Jalanin
```bash
npm install
cp .env.example .env     # isi SESSION_SECRET
npm run build:css        # (css udah ke-build, ini kalo ngubah view/class)
npm run dev              # atau: npm start
```
Buka http://localhost:3000 (pake browser yang ada ekstensi MetaMask).

## Alur login
1. Client `POST /auth/challenge` {address} -> server bikin nonce + pesan (disimpan di session, expire 5 menit)
2. Client `signer.signMessage(message)` di MetaMask
3. Client `POST /auth/verify` {address, signature} -> server `verifyMessage`, recover public key dari signature, bikin session baru

## Struktur (MVC)
```
src/
  config/        env & konfigurasi
  models/        userModel (in-memory, ganti ke DB sesuka lu)
  services/      authService (challenge, verify signature, recover pubkey)
  controllers/   authController, dashboardController
  middlewares/   requireAuth, guestOnly
  routes/        authRoutes, dashboardRoutes
  views/         EJS (login, dashboard, transfer, error + partials)
  styles/        input.css (Tailwind)
public/          css build + js client
```

## Catatan production
- Session pake MemoryStore -> ganti Redis/DB store.
- Set `NODE_ENV=production`, `SESSION_SECRET` kuat, dan jalanin di belakang HTTPS.
- Transfer ditandatangani & dikirim langsung dari MetaMask user (server ga pernah pegang private key).
