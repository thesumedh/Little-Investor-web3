const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const StellarSdk = require('@stellar/stellar-sdk');

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const SOROBAN_RPC = 'https://soroban-testnet.stellar.org';

const horizonServer = new StellarSdk.Horizon.Server(HORIZON_URL);
const sorobanServer = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC, { allowHttp: false });

// ── Master / sponsor keypair ────────────────────────────────────────────────
const envPath = path.join(__dirname, '../.env');
let secretKey = process.env.STELLAR_MASTER_SECRET;

if (!secretKey) {
  const pair = StellarSdk.Keypair.random();
  secretKey = pair.secret();
  try { fs.appendFileSync(envPath, `\nSTELLAR_MASTER_SECRET=${secretKey}\nSPONSOR_SECRET=${secretKey}\n`); } catch (e) {}
  process.env.STELLAR_MASTER_SECRET = secretKey;
  process.env.SPONSOR_SECRET = secretKey;
}
const masterKeypair = StellarSdk.Keypair.fromSecret(secretKey);

// Auto-fund master key via Friendbot on startup
(async () => {
  try {
    const bal = await horizonServer.loadAccount(masterKeypair.publicKey());
    const xlm = bal.balances.find(b => b.asset_type === 'native');
    if (!xlm || parseFloat(xlm.balance) < 5) {
      await axios.get(`https://friendbot.stellar.org/?addr=${masterKeypair.publicKey()}`);
      console.log('Master key funded via Friendbot.');
    }
  } catch (e) {
    try {
      await axios.get(`https://friendbot.stellar.org/?addr=${masterKeypair.publicKey()}`);
      console.log('Master key created and funded via Friendbot.');
    } catch (e2) {}
  }
})();

// ── Soroban helpers ──────────────────────────────────────────────────────────

async function simulateAndSend(tx, keypair) {
  const sim = await sorobanServer.simulateTransaction(tx);
  if (StellarSdk.SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error('Simulation failed: ' + JSON.stringify(sim.error));
  }
  const assembled = StellarSdk.assembleTransaction(tx, sim).build();
  assembled.sign(keypair);
  const send = await sorobanServer.sendTransaction(assembled);
  if (send.status === 'ERROR') {
    throw new Error('Submit failed: ' + JSON.stringify(send.errorResult));
  }
  return await pollSoroban(send.hash);
}

async function pollSoroban(hash, attempts = 30) {
  for (let i = 0; i < attempts; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const result = await sorobanServer.getTransaction(hash);
    if (result.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.SUCCESS) return result;
    if (result.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.FAILED) {
      throw new Error('Soroban transaction failed: ' + JSON.stringify(result.resultXdr));
    }
  }
  throw new Error('Soroban transaction timed out');
}

function toScVal(value, type) {
  return StellarSdk.nativeToScVal(value, { type });
}

// ── Exports ──────────────────────────────────────────────────────────────────

exports.createChildProfile = async (req, res) => {
  try {
    const pair = StellarSdk.Keypair.random();
    await axios.get(`https://friendbot.stellar.org/?addr=${pair.publicKey()}`);
    res.json({ success: true, publicKey: pair.publicKey(), secret: pair.secret() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBalance = async (req, res) => {
  const { address } = req.params;
  try {
    const acct = await horizonServer.loadAccount(address);
    const xlm = acct.balances.find(b => b.asset_type === 'native');
    res.json({ success: true, balance: xlm ? parseFloat(xlm.balance) : 0, sequence: acct.sequence });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.json({ success: true, balance: 0, status: 'unfunded' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.fundFaucet = async (req, res) => {
  const { address } = req.body;
  try {
    await axios.get(`https://friendbot.stellar.org/?addr=${address}`);
    res.json({ success: true, message: 'Account funded with testnet XLM! 🪙' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Friendbot faucet limit reached or address already funded.' });
  }
};

// Deploy Soroban vault contract — pure SDK, no CLI required
exports.deployVault = async (req, res) => {
  try {
    const wasmPath = path.resolve(
      __dirname,
      '../../contracts/vault/target/wasm32-unknown-unknown/release/allowance_vault.wasm'
    );
    if (!fs.existsSync(wasmPath)) {
      return res.status(404).json({
        success: false,
        error: 'WASM not found. Run: cd contracts/vault && cargo build --target wasm32-unknown-unknown --release'
      });
    }
    const wasmBytes = fs.readFileSync(wasmPath);

    // Step 1: Upload WASM → get wasm hash
    const acct1 = await sorobanServer.getAccount(masterKeypair.publicKey());
    const uploadTx = new StellarSdk.TransactionBuilder(acct1, {
      fee: (parseInt(StellarSdk.BASE_FEE) * 50).toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.uploadContractWasm({ wasm: wasmBytes }))
      .setTimeout(60)
      .build();

    const uploadResult = await simulateAndSend(uploadTx, masterKeypair);
    const wasmHashScVal = uploadResult.returnValue;
    const wasmHash = StellarSdk.scValToNative(wasmHashScVal); // Uint8Array

    // Step 2: Create contract from wasm hash
    const salt = crypto.randomBytes(32);
    const acct2 = await sorobanServer.getAccount(masterKeypair.publicKey());
    const createTx = new StellarSdk.TransactionBuilder(acct2, {
      fee: (parseInt(StellarSdk.BASE_FEE) * 50).toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.createContract({
        address: new StellarSdk.Address(masterKeypair.publicKey()),
        wasmHash,
        salt
      }))
      .setTimeout(60)
      .build();

    const createResult = await simulateAndSend(createTx, masterKeypair);
    const contractAddress = StellarSdk.Address.fromScVal(createResult.returnValue);
    const contractId = contractAddress.toString();

    // Persist to env for convenience
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const updated = envContent.replace(/^VAULT_CONTRACT_ID=.*$/m, `VAULT_CONTRACT_ID=${contractId}`);
      fs.writeFileSync(envPath, updated);
      process.env.VAULT_CONTRACT_ID = contractId;
    } catch (e) {}

    res.json({ success: true, contractId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Initialize vault (no auth required by contract)
exports.initializeVault = async (req, res) => {
  const { contractId, parent, child, limit } = req.body;
  try {
    const contract = new StellarSdk.Contract(contractId);
    const acct = await sorobanServer.getAccount(masterKeypair.publicKey());

    const tx = new StellarSdk.TransactionBuilder(acct, {
      fee: (parseInt(StellarSdk.BASE_FEE) * 10).toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(contract.call(
        'initialize',
        toScVal(new StellarSdk.Address(parent), 'address'),
        toScVal(new StellarSdk.Address(child), 'address'),
        toScVal(BigInt(limit), 'i128')
      ))
      .setTimeout(30)
      .build();

    await simulateAndSend(tx, masterKeypair);
    res.json({ success: true, result: 'Vault initialized successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Set spending limit (requires parent auth)
exports.setVaultLimit = async (req, res) => {
  const { contractId, limit, parentSecret, parentAddress } = req.body;
  try {
    const contract = new StellarSdk.Contract(contractId);

    if (!parentSecret) {
      // Freighter path — build and return XDR for client signing
      const acct = await horizonServer.loadAccount(parentAddress);
      const tx = new StellarSdk.TransactionBuilder(acct, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(contract.call('set_limit', toScVal(BigInt(limit), 'i128')))
        .setTimeout(60)
        .build();

      // Simulate first
      const sim = await sorobanServer.simulateTransaction(tx);
      if (StellarSdk.SorobanRpc.Api.isSimulationError(sim)) {
        throw new Error('Simulation failed: ' + JSON.stringify(sim.error));
      }
      const assembled = StellarSdk.assembleTransaction(tx, sim).build();
      return res.json({ success: true, needsSigning: true, xdr: assembled.toXDR() });
    }

    // Local secret path
    const parentKeypair = StellarSdk.Keypair.fromSecret(parentSecret);
    const acct = await sorobanServer.getAccount(parentKeypair.publicKey());
    const tx = new StellarSdk.TransactionBuilder(acct, {
      fee: (parseInt(StellarSdk.BASE_FEE) * 10).toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(contract.call('set_limit', toScVal(BigInt(limit), 'i128')))
      .setTimeout(30)
      .build();

    await simulateAndSend(tx, parentKeypair);
    res.json({ success: true, result: 'Spending limit updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Record spending (requires child auth)
exports.vaultSpend = async (req, res) => {
  const { contractId, amount, childSecret } = req.body;
  try {
    const signerKeypair = childSecret
      ? StellarSdk.Keypair.fromSecret(childSecret)
      : masterKeypair;
    const contract = new StellarSdk.Contract(contractId);
    const acct = await sorobanServer.getAccount(signerKeypair.publicKey());

    const tx = new StellarSdk.TransactionBuilder(acct, {
      fee: (parseInt(StellarSdk.BASE_FEE) * 10).toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(contract.call('spend', toScVal(BigInt(amount), 'i128')))
      .setTimeout(30)
      .build();

    await simulateAndSend(tx, signerKeypair);
    res.json({ success: true, result: 'Spend recorded on-chain' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Record saving (requires child auth)
exports.vaultSave = async (req, res) => {
  const { contractId, amount, childSecret } = req.body;
  try {
    const signerKeypair = childSecret
      ? StellarSdk.Keypair.fromSecret(childSecret)
      : masterKeypair;
    const contract = new StellarSdk.Contract(contractId);
    const acct = await sorobanServer.getAccount(signerKeypair.publicKey());

    const tx = new StellarSdk.TransactionBuilder(acct, {
      fee: (parseInt(StellarSdk.BASE_FEE) * 10).toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(contract.call('save', toScVal(BigInt(amount), 'i128')))
      .setTimeout(30)
      .build();

    await simulateAndSend(tx, signerKeypair);
    res.json({ success: true, result: 'Save recorded on-chain' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get vault details via Soroban simulation (read-only)
exports.getVaultDetails = async (req, res) => {
  const { contractId } = req.params;
  try {
    const contract = new StellarSdk.Contract(contractId);
    const acct = await sorobanServer.getAccount(masterKeypair.publicKey());

    const tx = new StellarSdk.TransactionBuilder(acct, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(contract.call('get_details'))
      .setTimeout(30)
      .build();

    const sim = await sorobanServer.simulateTransaction(tx);
    if (StellarSdk.SorobanRpc.Api.isSimulationError(sim)) {
      throw new Error('Simulation failed: ' + JSON.stringify(sim.error));
    }

    // Parse the tuple result: (parent, child, limit, spent, saved)
    const raw = StellarSdk.scValToNative(sim.result.retval);
    res.json({
      success: true,
      details: {
        parent: raw[0]?.toString(),
        child: raw[1]?.toString(),
        dailyLimit: raw[2]?.toString(),
        spent: raw[3]?.toString(),
        saved: raw[4]?.toString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Send XLM reward directly from master key to child
exports.sendReward = async (req, res) => {
  const { childAddress, amount } = req.body;
  try {
    const sourceAccount = await horizonServer.loadAccount(masterKeypair.publicKey());
    const xlmAmount = Math.max(0.5, parseFloat(amount) * 0.1).toFixed(7);

    // Check if destination exists; create if needed
    let destExists = false;
    try { await horizonServer.loadAccount(childAddress); destExists = true; } catch (e) {}

    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    });

    if (destExists) {
      txBuilder.addOperation(StellarSdk.Operation.payment({
        destination: childAddress,
        asset: StellarSdk.Asset.native(),
        amount: xlmAmount
      }));
    } else {
      txBuilder.addOperation(StellarSdk.Operation.createAccount({
        destination: childAddress,
        startingBalance: Math.max(1.5, parseFloat(xlmAmount)).toFixed(7)
      }));
    }

    const tx = txBuilder.setTimeout(30).build();
    tx.sign(masterKeypair);
    const result = await horizonServer.submitTransaction(tx);
    res.json({ success: true, hash: result.hash, ledger: result.ledger });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Build payment XDR (Freighter) or execute directly (local secret)
exports.sendPayment = async (req, res) => {
  const { sourceAddress, destinationAddress, amount, sourceSecret } = req.body;
  try {
    const xlmAmount = parseFloat(amount).toFixed(7);
    if (!sourceSecret) {
      const acct = await horizonServer.loadAccount(sourceAddress);
      const tx = new StellarSdk.TransactionBuilder(acct, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: destinationAddress,
          asset: StellarSdk.Asset.native(),
          amount: xlmAmount
        }))
        .setTimeout(60)
        .build();
      return res.json({ success: true, needsSigning: true, xdr: tx.toXDR() });
    }

    const signer = StellarSdk.Keypair.fromSecret(sourceSecret);
    const acct = await horizonServer.loadAccount(signer.publicKey());
    const tx = new StellarSdk.TransactionBuilder(acct, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(),
        amount: xlmAmount
      }))
      .setTimeout(60)
      .build();
    tx.sign(signer);
    const result = await horizonServer.submitTransaction(tx);
    res.json({ success: true, hash: result.hash });
  } catch (error) {
    const detail = error.response?.data?.extras?.result_codes || error.message;
    res.status(500).json({ success: false, error: JSON.stringify(detail) });
  }
};

// Submit a pre-signed XDR transaction
exports.submitTransaction = async (req, res) => {
  const { signedXdr } = req.body;
  try {
    // Try Soroban first, fall back to Horizon
    let result;
    try {
      const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET);
      result = await sorobanServer.sendTransaction(tx);
      if (result.status === 'ERROR') throw new Error(JSON.stringify(result.errorResult));
      // Poll for final result
      const final = await pollSoroban(result.hash);
      return res.json({ success: true, hash: result.hash, status: final.status });
    } catch (sorobanErr) {
      // Fall back to Horizon for regular transactions
      const tx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET);
      result = await horizonServer.submitTransaction(tx);
      return res.json({ success: true, hash: result.hash });
    }
  } catch (error) {
    const detail = error.response?.data?.extras?.result_codes || error.message;
    res.status(500).json({ success: false, error: JSON.stringify(detail) });
  }
};
