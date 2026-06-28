/**
 * LittleInvestors — Real Freighter Wallet Integration
 *
 * RULES:
 *   - Freighter extension is REQUIRED. No demo wallets, no mock keys.
 *   - Users pay their own transaction fees from their own Freighter wallet.
 *   - The backend (server.js) only acts as a CORS proxy + transaction submitter.
 *   - No sponsor keys used for user transactions.
 *
 * Freighter API (v2+):
 *   window.freighterApi.isConnected()          → { isConnected }
 *   window.freighterApi.getAddress()           → { address, error }
 *   window.freighterApi.getNetworkDetails()    → { networkPassphrase, ... }
 *   window.freighterApi.signTransaction(xdr, { networkPassphrase }) → { signedTxXdr, error }
 */
(function () {
  'use strict';

  const HORIZON_URL        = 'https://horizon-testnet.stellar.org';
  const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';
  const STELLAR_EXPERT     = 'https://stellar.expert/explorer/testnet';

  // ─── Global wallet state (read-only externally) ──────────────────────────
  window.stellarWallet = {
    publicKey: null,
    balance: null,
    isConnected: false,
    networkPassphrase: NETWORK_PASSPHRASE,
  };

  // ─── Freighter detection ─────────────────────────────────────────────────

  function getWalletApi() {
    if (typeof window.freighterApi !== 'undefined') return window.freighterApi;
    if (typeof window.stellar !== 'undefined') return window.stellar;
    if (typeof window.stellarPubnet !== 'undefined') return window.stellarPubnet;
    return null;
  }

  function freighterAvailable() {
    return getWalletApi() !== null;
  }

  // Show a full-page "Install Freighter" overlay (not a toast).
  function showFreighterRequired() {
    // Only show once
    if (document.getElementById('freighter-required-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'freighter-required-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: rgba(5,22,53,0.92); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      font-family: Inter, sans-serif;
    `;
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:20px;padding:48px;max-width:460px;width:90%;text-align:center;box-shadow:0 32px 64px rgba(0,0,0,0.3)">
        <div style="width:72px;height:72px;background:#051635;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px">
          <span style="color:#fff;font-size:36px;font-family:'Material Symbols Outlined'">account_balance_wallet</span>
        </div>
        <h2 style="font-size:24px;font-weight:700;color:#051635;margin:0 0 12px">Freighter Wallet Required</h2>
        <p style="color:#45464e;font-size:16px;line-height:1.6;margin:0 0 32px">
          LittleInvestors uses <strong>real Stellar Testnet transactions</strong>.
          You need the Freighter browser extension to connect your wallet and sign transactions.
        </p>
        <a href="https://www.freighter.app/" target="_blank" rel="noopener"
          style="display:inline-block;background:#051635;color:#fff;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:600;text-decoration:none;margin-bottom:12px">
          Install Freighter Extension
        </a>
        <p style="color:#75777f;font-size:13px;margin:12px 0 0">
          After installing, refresh this page and click <strong>Connect Wallet</strong>.
        </p>
        <button onclick="document.getElementById('freighter-required-overlay').remove()"
          style="margin-top:16px;background:none;border:none;color:#75777f;font-size:13px;cursor:pointer;text-decoration:underline">
          Dismiss
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ─── Toast notification ──────────────────────────────────────────────────

  window.showStellarAlert = function (message, type = 'info', duration = 5000) {
    let toast = document.getElementById('stellar-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'stellar-toast';
      toast.style.cssText = `
        position:fixed;bottom:24px;left:24px;z-index:9998;
        padding:14px 20px;border-radius:12px;max-width:420px;
        font-family:Geist,Inter,sans-serif;font-size:14px;font-weight:500;
        display:flex;align-items:center;gap:10px;
        box-shadow:0 8px 32px rgba(0,0,0,0.18);
        transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);
        transform:translateY(80px);opacity:0;pointer-events:none;
        border:1px solid transparent;
      `;
      document.body.appendChild(toast);
    }
    const s = {
      success: { bg:'#059669', icon:'✅' },
      error:   { bg:'#dc2626', icon:'❌' },
      info:    { bg:'#051635', icon:'⏳' },
      warn:    { bg:'#d97706', icon:'⚠️' },
    }[type] || { bg:'#051635', icon:'ℹ️' };

    toast.style.background = s.bg;
    toast.style.color = '#fff';
    toast.innerHTML = `<span>${s.icon}</span><span>${message}</span>`;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
      toast.style.pointerEvents = 'auto';
    });
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
      toast.style.transform = 'translateY(80px)';
      toast.style.opacity = '0';
    }, duration);
  };

  // ─── UI update — propagates wallet state to all nav elements ────────────

  function updateAllUI() {
    const addr = window.stellarWallet.publicKey;
    const bal  = window.stellarWallet.balance;
    const short = addr ? addr.slice(0,6) + '…' + addr.slice(-4) : null;
    const balStr = bal ? (parseFloat(bal).toLocaleString(undefined, {
      minimumFractionDigits: 2, maximumFractionDigits: 4
    }) + ' XLM') : null;

    // Nav address
    const addrEl = document.getElementById('stellar-address-nav');
    if (addrEl) addrEl.textContent = short || 'No Wallet';

    // Nav balance
    const balEl = document.getElementById('stellar-balance-nav');
    if (balEl) balEl.textContent = balStr || '-- XLM';

    // Wallet dot
    const dot = document.getElementById('wallet-dot');
    if (dot) dot.style.background = addr ? '#10b981' : '#9ca3af';

    // Connect button
    const btn = document.getElementById('connect-wallet-btn');
    if (btn) {
      if (addr) {
        btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle">check_circle</span> ${short}`;
        btn.style.background = '#006783';
      } else {
        btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle">account_balance_wallet</span> Connect Wallet`;
        btn.style.background = '';
      }
    }

    // Certificate wallet address field
    const certAddr = document.getElementById('cert-wallet-address');
    if (certAddr) certAddr.textContent = addr ? short : '— Connect Wallet —';

    // Certificate issue date
    const certDate = document.getElementById('cert-issue-date');
    if (certDate && addr) {
      certDate.textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    }

    // Balance widget (Day 1)
    const balWidget = document.getElementById('balance-amount');
    if (balWidget && balStr) balWidget.textContent = balStr;

    // Fire custom event for page-level handlers
    document.dispatchEvent(new CustomEvent('stellarWalletUpdated', {
      detail: { ...window.stellarWallet },
    }));
  }

  // ─── Connect Wallet (Freighter only) ────────────────────────────────────

  window.connectStellarWallet = async function () {
    const api = getWalletApi();
    if (!api) {
      showFreighterRequired();
      return;
    }

    try {
      window.showStellarAlert('Opening Freighter…', 'info', 10000);

      // 1. Request access from Freighter (this pops up the authorization modal)
      let address = '';
      let error = null;

      if (typeof api.requestAccess === 'function') {
        const access = await api.requestAccess();
        address = access.address || access;
        error = access.error;
      } else if (typeof api.getAddress === 'function') {
        const res = await api.getAddress();
        address = res.address || res;
        error = res.error;
      }

      if (error) {
        window.showStellarAlert('Freighter: ' + error, 'error');
        return;
      }
      if (!address || typeof address !== 'string') {
        window.showStellarAlert('Connection cancelled or wallet locked.', 'warn');
        return;
      }

      // 2. Verify we're on the right network
      let netDetails = null;
      if (typeof api.getNetworkDetails === 'function') {
        netDetails = await api.getNetworkDetails();
      } else if (typeof api.getNetwork === 'function') {
        const net = await api.getNetwork();
        netDetails = { networkPassphrase: net === 'PUBLIC' ? 'Public Global Stellar Network ; October 2015' : NETWORK_PASSPHRASE };
      }

      if (netDetails && netDetails.networkPassphrase !== NETWORK_PASSPHRASE) {
        window.showStellarAlert(
          `Wrong network! Switch wallet to "Test SDF Network" (Testnet).`,
          'error',
          10000
        );
        return;
      }

      window.stellarWallet.publicKey = address;
      window.stellarWallet.isConnected = true;
      sessionStorage.setItem('li_wallet', address);

      updateAllUI();
      window.showStellarAlert('Wallet connected!', 'success');

      // 3. Fetch balance immediately
      await window.refreshStellarBalance();

    } catch (e) {
      console.error('[connectStellarWallet]', e);
      window.showStellarAlert('Connection failed: ' + e.message, 'error');
    }
  };

  // ─── Disconnect ──────────────────────────────────────────────────────────

  window.disconnectStellarWallet = function () {
    window.stellarWallet.publicKey = null;
    window.stellarWallet.balance   = null;
    window.stellarWallet.isConnected = false;
    sessionStorage.removeItem('li_wallet');
    updateAllUI();
    window.showStellarAlert('Wallet disconnected.', 'info');
  };

  // ─── Refresh Balance ─────────────────────────────────────────────────────

  window.refreshStellarBalance = async function () {
    const pk = window.stellarWallet.publicKey;
    if (!pk) return;

    try {
      // Try backend first (avoids CORS issues)
      const res = await fetch('/api/stellar/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: pk }),
      });
      const data = await res.json();
      if (data.balance !== undefined) {
        window.stellarWallet.balance = data.balance;
        updateAllUI();
        return;
      }
    } catch (_) {}

    // Fallback: direct Horizon (browser fetch, no CORS issue for GET)
    try {
      const res = await fetch(`${HORIZON_URL}/accounts/${pk}`);
      if (res.ok) {
        const acc = await res.json();
        const native = acc.balances?.find(b => b.asset_type === 'native');
        if (native) {
          window.stellarWallet.balance = native.balance;
          updateAllUI();
        }
      } else if (res.status === 404) {
        window.stellarWallet.balance = '0.0000000';
        updateAllUI();
        window.showStellarAlert(
          'Your wallet has no XLM on testnet. Fund it at https://laboratory.stellar.org/#account-creator',
          'warn', 10000
        );
      }
    } catch (e) {
      console.warn('[refreshStellarBalance]', e.message);
    }
  };

  // ─── Build transaction (unsigned) ────────────────────────────────────────

  async function buildPaymentTx(fromPK, toPK, amountXLM, memo) {
    if (!window.StellarSdk) throw new Error('Stellar SDK not loaded');
    const SDK = window.StellarSdk;

    // Load account sequence number from Horizon
    const res = await fetch(`${HORIZON_URL}/accounts/${fromPK}`);
    if (!res.ok) {
      if (res.status === 404)
        throw new Error('Your account has no XLM. Fund it at laboratory.stellar.org/#account-creator');
      throw new Error('Failed to load account from Horizon');
    }
    const accData = await res.json();
    const account = new SDK.Account(fromPK, accData.sequence);

    const builder = new SDK.TransactionBuilder(account, {
      fee: SDK.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(SDK.Operation.payment({
      destination: toPK,
      asset: SDK.Asset.native(),
      amount: String(amountXLM),
    }));

    if (memo) builder.addMemo(SDK.Memo.text(memo));

    builder.setTimeout(180);
    return builder.build();
  }

  // ─── Sign with Freighter ─────────────────────────────────────────────────

  async function freighterSign(txXdr) {
    const api = getWalletApi();
    if (!api) {
      showFreighterRequired();
      throw new Error('Freighter not installed');
    }
    
    const res = await api.signTransaction(txXdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const signedTxXdr = res.signedTxXdr || (typeof res === 'string' ? res : null);
    const error = res.error;

    if (error) throw new Error('Freighter signing failed: ' + error);
    if (!signedTxXdr) throw new Error('No signed XDR returned from Freighter');
    return signedTxXdr;
  }

  // ─── Submit to Horizon (via backend as CORS proxy) ───────────────────────

  async function submitTx(signedXdr) {
    // Try backend first
    try {
      const res = await fetch('/api/stellar/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signedXdr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      return data;
    } catch (backendErr) {
      // Fallback: submit directly to Horizon
      if (!window.StellarSdk) throw backendErr;
      const srv = new window.StellarSdk.Horizon.Server(HORIZON_URL);
      const tx = window.StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      const result = await srv.submitTransaction(tx);
      return {
        txHash: result.hash,
        ledger: result.ledger,
        explorerUrl: `${STELLAR_EXPERT}/tx/${result.hash}`,
      };
    }
  }

  // ─── Mint Certificate ─────────────────────────────────────────────────────
  //
  //  The certification transaction is:
  //    - 1 XLM payment from user → platform receiving address
  //    - Signed by user in Freighter (user pays their own fee)
  //    - Submitted to Stellar Testnet
  //    - Memo = "LittleInvestors-Cert"
  //
  //  In a full production deployment this would be a Soroban
  //  contract invocation of issue_certificate(). The contract ID
  //  is read from the backend /health endpoint once deployed.

  window.mintCertificate = async function () {
    const pk = window.stellarWallet.publicKey;
    if (!pk) {
      window.showStellarAlert('Connect your Freighter wallet first.', 'error');
      return null;
    }
    if (!freighterAvailable()) {
      showFreighterRequired();
      return null;
    }

    try {
      // 1. Get receiving address from backend
      const health = await fetch('/health').then(r => r.json()).catch(() => null);
      const destination = (health && health.platformAddress) ||
        'GDW3DID4O27B3EEBUVGJ7MWE2XLG45V2MTBCVNRKC74HC2EKRPHU3MJD'; // Platform wallet

      window.showStellarAlert('Building transaction…', 'info');

      // 2. Build the payment
      const tx = await buildPaymentTx(pk, destination, '1', 'LittleInvestors-Cert');

      window.showStellarAlert('Please approve in Freighter…', 'info', 60000);

      // 3. User signs in Freighter
      const signedXdr = await freighterSign(tx.toXDR());

      window.showStellarAlert('Submitting payment to Stellar Testnet…', 'info');

      // 4. Submit payment
      const paymentResult = await submitTx(signedXdr);
      const paymentHash = paymentResult.txHash;

      window.showStellarAlert('Payment confirmed! Minting certificate on-chain...', 'info', 30000);

      // 5. Ask backend to invoke Soroban contract to issue the certificate
      const mintRes = await fetch('/api/stellar/mint-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: pk,
          txHash: paymentHash
        })
      });

      const mintData = await mintRes.json();
      if (!mintRes.ok) {
        throw new Error(mintData.error || 'Failed to mint on-chain certificate');
      }

      // 6. Refresh balance
      setTimeout(() => window.refreshStellarBalance(), 3000);

      window.showStellarAlert('Certificate minted on-chain! 🎉', 'success', 10000);
      return {
        success: true,
        txHash: mintData.txHash,
        explorerUrl: mintData.explorerUrl,
        contractUrl: mintData.contractUrl
      };

    } catch (e) {
      console.error('[mintCertificate]', e);
      window.showStellarAlert(e.message, 'error', 8000);
      return null;
    }
  };

  // ─── Send practice transaction via Freighter ─────────────────────────────
  window.sendStellarPayment = async function (destinationPK, amountXLM, memoText) {
    const pk = window.stellarWallet.publicKey;
    if (!pk) {
      window.showStellarAlert('Connect your Freighter wallet first.', 'error');
      throw new Error('Wallet not connected');
    }
    if (!freighterAvailable()) {
      showFreighterRequired();
      throw new Error('Freighter not installed');
    }

    try {
      window.showStellarAlert('Building payment transaction...', 'info');
      const tx = await buildPaymentTx(pk, destinationPK, amountXLM, memoText);

      window.showStellarAlert('Please approve in Freighter...', 'info', 60000);
      const signedXdr = await freighterSign(tx.toXDR());

      window.showStellarAlert('Submitting to Stellar Testnet...', 'info');
      const result = await submitTx(signedXdr);

      // Refresh balance after success
      setTimeout(() => window.refreshStellarBalance(), 3000);

      window.showStellarAlert('Payment successful! 🎉', 'success');
      return result;
    } catch (e) {
      console.error('[sendStellarPayment]', e);
      window.showStellarAlert(e.message, 'error', 8000);
      throw e;
    }
  };

  // ─── Auto-init on page load ───────────────────────────────────────────────

  function init() {
    // Restore session (address only — re-verify with Freighter)
    const saved = sessionStorage.getItem('li_wallet');
    const api = getWalletApi();
    if (saved && api) {
      window.stellarWallet.publicKey = saved;
      window.stellarWallet.isConnected = true;
      updateAllUI();
      // Silently refresh balance; re-verify address is still current
      if (typeof api.getAddress === 'function') {
        api.getAddress().then((res) => {
          const address = res.address || res;
          if (address && address !== saved) {
            // Freighter switched accounts
            window.stellarWallet.publicKey = address;
            sessionStorage.setItem('li_wallet', address);
            updateAllUI();
          }
        }).catch(() => {});
      }
      window.refreshStellarBalance();
    } else if (saved && !api) {
      // Had a session but Freighter not installed now — clear
      sessionStorage.removeItem('li_wallet');
    }

    // Auto-refresh every 30s while visible
    setInterval(() => {
      if (window.stellarWallet.isConnected && document.visibilityState === 'visible') {
        window.refreshStellarBalance();
      }
    }, 30000);

    // Show Freighter install banner if detected
    const banner = document.getElementById('freighter-install-banner');
    if (banner) banner.style.display = freighterAvailable() ? 'none' : 'block';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 50);
  }

})();
