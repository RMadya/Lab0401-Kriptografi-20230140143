/* Helper bareng buat dashboard & transfer: isi saldo + nama network. */
window.loadWalletInfo = async (address) => {
  const balanceEl = document.getElementById('balance');
  const networkEl = document.getElementById('network');
  const symbolEl = document.getElementById('symbol');
  if (!window.ethereum) {
    if (balanceEl) balanceEl.textContent = '-';
    if (networkEl) networkEl.textContent = 'MetaMask ga kedeteksi';
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const [balance, network] = await Promise.all([provider.getBalance(address), provider.getNetwork()]);
    if (balanceEl) balanceEl.textContent = Number(ethers.formatEther(balance)).toLocaleString('en-US', { maximumFractionDigits: 6 });
    if (networkEl) networkEl.textContent = `${network.name === 'unknown' ? 'Chain' : network.name} (chainId ${network.chainId})`;
    if (symbolEl && network.chainId !== 1n) symbolEl.textContent = 'ETH / native token';
  } catch (err) {
    if (balanceEl) balanceEl.textContent = '-';
    if (networkEl) networkEl.textContent = 'Gagal ambil data network';
  }
};
