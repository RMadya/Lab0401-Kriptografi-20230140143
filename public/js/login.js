(() => {
  const btn = document.getElementById('connect-btn');
  const label = document.getElementById('connect-label');
  const statusEl = document.getElementById('status');
  const installLink = document.getElementById('install-link');

  const setStatus = (msg, isError = false) => {
    statusEl.textContent = msg;
    statusEl.className = 'mt-4 min-h-[1.5rem] text-sm ' + (isError ? 'text-red-400' : 'text-slate-400');
  };

  const postJson = async (url, body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request gagal');
    return data;
  };

  if (!window.ethereum) {
    setStatus('MetaMask ga kedeteksi di browser ini.', true);
    installLink.classList.remove('hidden');
    btn.disabled = true;
    return;
  }

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    label.textContent = 'Menunggu MetaMask…';
    setStatus('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // munculin popup connect kalo belum
      const address = await signer.getAddress();

      setStatus('Minta challenge ke server…');
      const { message } = await postJson('/auth/challenge', { address });

      setStatus('Tanda tangani pesan di MetaMask…');
      const signature = await signer.signMessage(message);

      setStatus('Verifikasi…');
      const { redirect } = await postJson('/auth/verify', { address, signature });

      window.location.href = redirect || '/dashboard';
    } catch (err) {
      const rejected = err && (err.code === 'ACTION_REJECTED' || err.code === 4001);
      setStatus(rejected ? 'Kamu nolak request di MetaMask.' : err.message || 'Login gagal', true);
      btn.disabled = false;
      label.textContent = 'Connect MetaMask';
    }
  });
})();
