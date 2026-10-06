/**
 * User model (in-memory).
 * Ganti isi file ini kalo mau pake DB (Sequelize / Prisma / Mongoose),
 * controller & service ga perlu diubah selama interface-nya sama.
 */
const users = new Map(); // key: address lowercase

const UserModel = {
  findByAddress(address) {
    return users.get(address.toLowerCase()) || null;
  },

  upsertOnLogin({ address, publicKey, compressedPublicKey }) {
    const key = address.toLowerCase();
    const now = new Date();
    const existing = users.get(key);

    const user = existing
      ? { ...existing, publicKey, compressedPublicKey, lastLoginAt: now, loginCount: existing.loginCount + 1 }
      : { address, publicKey, compressedPublicKey, createdAt: now, lastLoginAt: now, loginCount: 1 };

    users.set(key, user);
    return user;
  },
};

module.exports = UserModel;
