// Helper functions for client-side Freighter & Stellar integration

const StellarHelper = {
  // Check if Freighter extension is installed in the browser
  isFreighterAvailable: () => {
    return (typeof window.freighterApi !== 'undefined') || (typeof window.stellar !== 'undefined');
  },

  // Connects Freighter and returns the public key address
  connectWallet: async () => {
    const provider = window.freighterApi || window.stellar;
    if (!provider) {
      throw new Error('Freighter wallet extension not found! Please install it from freighter.app 🔐');
    }
    try {
      // Connect to Freighter
      const isConnected = await provider.isConnected();
      if (!isConnected) {
        throw new Error('Freighter wallet is locked. Please unlock it.');
      }
      
      const publicKey = await provider.getPublicKey();
      localStorage.setItem('li_parent_stellar_address', publicKey);
      return publicKey;
    } catch (err) {
      throw new Error(err.message || 'Failed to connect to Freighter wallet.');
    }
  },

  disconnectWallet: () => {
    localStorage.removeItem('li_parent_stellar_address');
    localStorage.removeItem('li_parent_stellar_secret');
    localStorage.removeItem('li_contract_id');
  },

  getSavedAddress: () => {
    return localStorage.getItem('li_parent_stellar_address');
  },

  // Query parent balance
  getParentBalance: async (address) => {
    try {
      const res = await fetch(`/api/stellar/balance/${address}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error fetching Stellar balance:', err);
      return { success: false, balance: 0 };
    }
  },

  // Fund account using Friendbot faucet
  fundAccount: async (address) => {
    const res = await fetch('/api/stellar/faucet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    return await res.json();
  },

  // Create child profile on testnet
  createChildProfile: async () => {
    const res = await fetch('/api/stellar/child/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('li_child_stellar_address', data.publicKey);
      localStorage.setItem('li_child_stellar_secret', data.secret);
    }
    return data;
  },

  // Deploy smart contract vault
  deployVault: async () => {
    const res = await fetch('/api/stellar/vault/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('li_contract_id', data.contractId);
    }
    return data;
  },

  // Initialize deployed vault
  initializeVault: async (contractId, parent, child, limit) => {
    const res = await fetch('/api/stellar/vault/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractId, parent, child, limit })
    });
    return await res.json();
  },

  // Set Spending Limit
  setSpendingLimit: async (contractId, limit) => {
    const parentSecret = localStorage.getItem('li_parent_stellar_secret') || '';
    const parentAddress = localStorage.getItem('li_parent_stellar_address') || '';
    const res = await fetch('/api/stellar/vault/set-limit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractId, limit, parentSecret, parentAddress })
    });
    const data = await res.json();
    if (data.success && data.needsSigning) {
      try {
        const provider = window.freighterApi || window.stellar;
        if (!provider) {
          throw new Error('Freighter wallet extension not found! Please install it from freighter.app 🔐');
        }
        // Sign transaction using Freighter
        const signedXdr = await provider.signTransaction(data.xdr, { network: 'TESTNET' });
        
        // Submit the signed transaction via backend
        const submitRes = await fetch('/api/stellar/transaction/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signedXdr })
        });
        return await submitRes.json();
      } catch (err) {
        return { success: false, error: err.message || 'Freighter signing failed.' };
      }
    }
    return data;
  },

  // Spend allowance from vault
  vaultSpend: async (contractId, amount) => {
    const childSecret = localStorage.getItem('li_child_stellar_secret') || '';
    const res = await fetch('/api/stellar/vault/spend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractId, amount, childSecret })
    });
    return await res.json();
  },

  // Save to vault (goals)
  vaultSave: async (contractId, amount) => {
    const childSecret = localStorage.getItem('li_child_stellar_secret') || '';
    const res = await fetch('/api/stellar/vault/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractId, amount, childSecret })
    });
    return await res.json();
  },

  // Query details from vault
  getVaultDetails: async (contractId) => {
    try {
      const res = await fetch(`/api/stellar/vault/details/${contractId}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Send quiz reward from treasury
  sendQuizReward: async (childAddress, amount) => {
    const res = await fetch('/api/stellar/vault/reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childAddress, amount })
    });
    return await res.json();
  },

  // Send payment from parent to child on-chain
  sendPayment: async (sourceAddress, destinationAddress, amount, sourceSecret) => {
    const res = await fetch('/api/stellar/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceAddress, destinationAddress, amount, sourceSecret })
    });
    const data = await res.json();
    if (data.success && data.needsSigning) {
      try {
        const provider = window.freighterApi || window.stellar;
        if (!provider) {
          throw new Error('Freighter wallet extension not found! Please install it from freighter.app 🔐');
        }
        const signedXdr = await provider.signTransaction(data.xdr, { network: 'TESTNET' });
        const submitRes = await fetch('/api/stellar/transaction/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signedXdr })
        });
        return await submitRes.json();
      } catch (err) {
        return { success: false, error: err.message || 'Freighter signing failed.' };
      }
    }
    return data;
  },

  // ── Gasless relay claim ──────────────────────────────────────────────────
  // Calls the sponsor relay endpoint — no gas, no wallet extension needed.
  // Sponsor sends XLM directly to the child wallet on Stellar Testnet.
  claimRewardGasless: async (childAddress, coins, action) => {
    try {
      const res = await fetch('/api/relayer/relay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: childAddress,
          action: action || 'Claim Quiz Reward',
          amount: coins
        })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

window.StellarHelper = StellarHelper;
