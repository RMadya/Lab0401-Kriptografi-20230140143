const crypto = require('crypto');
const { verifyMessage, hashMessage, SigningKey, getAddress, isAddress } = require('ethers');
const config = require('../config');

const AuthService = {
  isValidAddress(address) {
    return typeof address === 'string' && isAddress(address);
  },

  /** Bikin pesan yang bakal di-sign user (format mirip SIWE / EIP-4361). */
  createChallenge(address, host) {
    const nonce = crypto.randomBytes(16).toString('hex');
    const issuedAtIso = new Date().toISOString();
    const checksummed = getAddress(address);

    const message = [
      `${host} wants you to sign in with your Ethereum account:`,
      checksummed,
      '',
      'Sign this message to log in. It does not cost any gas.',
      '',
      `Nonce: ${nonce}`,
      `Issued At: ${issuedAtIso}`,
    ].join('\n');

    return { address: checksummed, nonce, message, issuedAt: Date.now() };
  },

  isChallengeExpired(challenge) {
    return !challenge || Date.now() - challenge.issuedAt > config.challengeTtlMs;
  },

  /**
   * Verifikasi signature. Return address + public key hasil recover.
   * Public key ga dikirim client, tapi di-recover dari signature.
   */
  verifySignature({ message, signature, address }) {
    const recovered = verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      throw new Error('Signature ga cocok sama address');
    }

    const digest = hashMessage(message);
    const publicKey = SigningKey.recoverPublicKey(digest, signature); // uncompressed (0x04...)
    const compressedPublicKey = SigningKey.computePublicKey(publicKey, true);

    return { address: getAddress(recovered), publicKey, compressedPublicKey };
  },
};

module.exports = AuthService;
