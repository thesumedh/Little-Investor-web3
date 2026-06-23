const axios = require('axios');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const StellarSdk = require('@stellar/stellar-sdk');

// Initialize master keypair for platform treasury/admin actions
let masterKeypair;
const envPath = path.join(__dirname, '../.env');
let secretKey = process.env.STELLAR_MASTER_SECRET;

if (!secretKey) {
  const pair = StellarSdk.Keypair.random();
  secretKey = pair.secret();
  try {
    fs.appendFileSync(envPath, `\nSTELLAR_MASTER_SECRET=${secretKey}\n`);
  } catch (e) {}
  process.env.STELLAR_MASTER_SECRET = secretKey;
  masterKeypair = pair;
} else {
  masterKeypair = StellarSdk.Keypair.fromSecret(secretKey);
}

// Ensure the treasury/master key is funded via Friendbot
const fundMasterKey = async () => {
  try {
    await axios.get(`https://friendbot.stellar.org/?addr=${masterKeypair.publicKey()}`);
  } catch (err) {}
};
fundMasterKey();

// Helper to execute terminal commands as promises
const runCli = (cmd, cwd = process.cwd()) => {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

exports.createChildProfile = async (req, res) => {
  try {
    const pair = StellarSdk.Keypair.random();
    // Pre-fund child account via Friendbot to initialize it on-chain
    await axios.get(`https://friendbot.stellar.org/?addr=${pair.publicKey()}`);
    res.json({
      success: true,
      publicKey: pair.publicKey(),
      secret: pair.secret()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBalance = async (req, res) => {
  const { address } = req.params;
  try {
    const response = await axios.get(`https://horizon-testnet.stellar.org/accounts/${address}`);
    const xlmLiquidity = response.data.balances.find(b => b.asset_type === 'native');
    res.json({
      success: true,
      balance: xlmLiquidity ? parseFloat(xlmLiquidity.balance) : 0,
      sequence: response.data.sequence
    });
  } catch (error) {
    // If account doesn't exist on-chain yet, return 0 balance
    if (error.response && error.response.status === 404) {
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
    res.status(500).json({ success: false, error: 'Friendbot faucet limit reached or request failed.' });
  }
};

exports.deployVault = async (req, res) => {
  try {
    const wasmPath = path.resolve(__dirname, '../../contracts/vault/target/wasm32-unknown-unknown/release/allowance_vault.wasm');
    if (!fs.existsSync(wasmPath)) {
      return res.status(404).json({ success: false, error: 'WASM build artifact not found. Please compile first.' });
    }

    // Deploy contract using Stellar CLI
    const deployCmd = `stellar contract deploy --wasm "${wasmPath}" --network testnet --source ${masterKeypair.secret()}`;
    const contractId = await runCli(deployCmd);
    
    res.json({ success: true, contractId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
};

exports.initializeVault = async (req, res) => {
  const { contractId, parent, child, limit } = req.body;
  try {
    const initCmd = `stellar contract invoke --id ${contractId} --network testnet --source ${masterKeypair.secret()} -- initialize --parent ${parent} --child ${child} --daily_limit ${limit}`;
    const result = await runCli(initCmd);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
};

exports.setVaultLimit = async (req, res) => {
  const { contractId, limit, parentSecret, parentAddress } = req.body;
  try {
    if (!parentSecret && parentAddress) {
      // Parent is using Freighter (no secret)
      // Build the transaction only and return the XDR
      const limitCmd = `stellar contract invoke --id ${contractId} --network testnet --source-account ${parentAddress} --build-only -- set_limit --limit ${limit}`;
      const xdr = await runCli(limitCmd);
      return res.json({ success: true, needsSigning: true, xdr });
    } else {
      // Parent is using local secret
      const signer = parentSecret || masterKeypair.secret();
      const limitCmd = `stellar contract invoke --id ${contractId} --network testnet --source ${signer} --sign-with-key ${signer} -- set_limit --limit ${limit}`;
      const result = await runCli(limitCmd);
      return res.json({ success: true, result });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
};

exports.vaultSpend = async (req, res) => {
  const { contractId, amount, childSecret } = req.body;
  try {
    const signer = childSecret || masterKeypair.secret();
    const spendCmd = `stellar contract invoke --id ${contractId} --network testnet --source ${signer} --sign-with-key ${signer} -- spend --amount ${amount}`;
    const result = await runCli(spendCmd);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
};

exports.vaultSave = async (req, res) => {
  const { contractId, amount, childSecret } = req.body;
  try {
    const signer = childSecret || masterKeypair.secret();
    const saveCmd = `stellar contract invoke --id ${contractId} --network testnet --source ${signer} --sign-with-key ${signer} -- save --amount ${amount}`;
    const result = await runCli(saveCmd);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
};

exports.getVaultDetails = async (req, res) => {
  const { contractId } = req.params;
  try {
    const detailsCmd = `stellar contract invoke --id ${contractId} --network testnet --source ${masterKeypair.secret()} -- get_details`;
    const resultRaw = await runCli(detailsCmd);
    
    // Parse the output tuples from CLI
    // Example: ["parent_addr", "child_addr", limit, spent, saved]
    // The output matches the rust tuple: (Address, Address, i128, i128, i128)
    const cleaned = resultRaw.replace(/[\r\n\t]/g, "").trim();
    res.json({ success: true, details: cleaned });
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
};

// Releases learn rewards on-chain from the master key to the child address
exports.sendReward = async (req, res) => {
  const { childAddress, amount } = req.body;
  try {
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    const sourceAccount = await server.loadAccount(masterKeypair.publicKey());
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: childAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString()
      }))
      .setTimeout(30)
      .build();
      
    transaction.sign(masterKeypair);
    const result = await server.submitTransaction(transaction);
    
    res.json({
      success: true,
      hash: result.hash,
      ledger: result.ledger
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.sendPayment = async (req, res) => {
  const { sourceAddress, destinationAddress, amount, sourceSecret } = req.body;
  try {
    if (!sourceSecret && sourceAddress) {
      // Parent is using Freighter (no secret)
      // Build the payment transaction only and return the XDR
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      const sourceAccount = await server.loadAccount(sourceAddress);
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: destinationAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString()
        }))
        .setTimeout(60)
        .build();
      
      const xdr = transaction.toXDR();
      return res.json({ success: true, needsSigning: true, xdr });
    } else {
      // Source secret is provided (local account)
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      const signer = StellarSdk.Keypair.fromSecret(sourceSecret);
      const sourceAccount = await server.loadAccount(signer.publicKey());
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: destinationAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString()
        }))
        .setTimeout(60)
        .build();
      
      transaction.sign(signer);
      const result = await server.submitTransaction(transaction);
      return res.json({ success: true, result });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || error.toString() });
  }
};

exports.submitTransaction = async (req, res) => {
  const { signedXdr } = req.body;
  try {
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    const transaction = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET);
    const result = await server.submitTransaction(transaction);
    res.json({ success: true, result });
  } catch (error) {
    let details = error.message;
    if (error.response && error.response.data && error.response.data.extras && error.response.data.extras.result_codes) {
      details = JSON.stringify(error.response.data.extras.result_codes);
    }
    res.status(500).json({ success: false, error: details });
  }
};
