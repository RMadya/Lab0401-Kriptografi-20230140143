(() => {
  const root = document.getElementById('dashboard');

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = 'Gagal';
      }
      setTimeout(() => (btn.textContent = original), 1500);
    });
  });

  // Reload kalo user ganti akun / network di MetaMask
  if (window.ethereum) {
    window.ethereum.on?.('accountsChanged', () => window.loadWalletInfo(root.dataset.address));
    window.ethereum.on?.('chainChanged', () => window.location.reload());
  }
  window.loadWalletInfo(root.dataset.address);
})();
