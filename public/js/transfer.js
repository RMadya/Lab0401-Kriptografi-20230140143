(() => {
  const root = document.getElementById('transfer-page');
  const sessionAddress = root.dataset.address;
  const form = document.getElementById('transfer-form');
  const toInput = document.getElementById('to');
  const amountInput = document.getElementById('amount');
  const sendBtn = document.getElementById('send-btn');
  const statusEl = document.getElementById('status');

  const setStatus = (msg, type = 'info') => {
    const colors = { info: 'text-slate-600', error: 'text-red-600', success: 'text-emerald-600' };
    statusEl.className = `mt-4 min-h-[1.5rem] break-all text-sm ${colors[type]}`;
    statusEl.textContent = msg;
  };

  window.loadWalletInfo(sessionAddress);
  if (window.ethereum) {
    window.ethereum.on?.('accountsChanged', () => window.loadWalletInfo(sessionAddress));
    window.ethereum.on?.('chainChanged', () => window.location.reload());
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');

    if (!window.ethereum) return setStatus('MetaMask ga kedeteksi.', 'error');

    const to = toInput.value.trim();
    const amount = amountInput.value.trim().replace(',', '.');

    if (!ethers.isAddress(to)) return setStatus('Alamat tujuan ga valid.', 'error');

    let value;
    try {
      value = ethers.parseEther(amount);
      if (value <= 0n) throw new Error();
    } catch {
      return setStatus('Jumlah ga valid.', 'error');
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'Menunggu konfirmasi…';

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const current = await signer.getAddress();

      if (current.toLowerCase() !== sessionAddress.toLowerCase()) {
        throw new Error('Akun aktif di MetaMask beda dari akun yang login. Ganti akun atau login ulang.');
      }

      const tx = await signer.sendTransaction({ to, value });
      setStatus(`Terkirim, nunggu konfirmasi. Hash: ${tx.hash}`);

      const receipt = await tx.wait();
      if (receipt && receipt.status === 1) {
        setStatus(`Berhasil. Hash: ${tx.hash}`, 'success');
        form.reset();
        window.loadWalletInfo(sessionAddress);
      } else {
        setStatus(`Transaksi gagal di chain. Hash: ${tx.hash}`, 'error');
      }
    } catch (err) {
      const rejected = err && (err.code === 'ACTION_REJECTED' || err.code === 4001);
      setStatus(rejected ? 'Kamu nolak transaksi di MetaMask.' : err.shortMessage || err.message || 'Transfer gagal', 'error');
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Kirim';
    }
  });
})();
