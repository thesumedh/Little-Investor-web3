const fs = require('fs');
const path = require('path');
const StellarSdk = require('@stellar/stellar-sdk');

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const LOG_FILE = path.join(__dirname, '../../relayer/data/transactions.json');

function getLogs() {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveLog(entry) {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const logs = getLogs();
    logs.unshift(entry);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf8');
  } catch (e) {
    console.error('Log write error:', e.message);
  }
}

// GET /health
exports.healthCheck = (req, res) => {
  const logs = getLogs();
  const sponsorSecret = process.env.SPONSOR_SECRET || process.env.STELLAR_MASTER_SECRET;
  let relayerAddress = 'not configured';
  try {
    relayerAddress = StellarSdk.Keypair.fromSecret(sponsorSecret).publicKey();
  } catch (e) {}

  res.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    relayerAddress,
    totalSponsoredTransactions: logs.length
  });
};

// GET /api/metrics
exports.getMetrics = (req, res) => {
  const logs = getLogs();
  const wallets = new Set();
  let totalCoins = 0;

  logs.forEach(l => {
    if (l.wallet) wallets.add(l.wallet);
    if (l.amount) totalCoins += parseFloat(l.amount);
  });

  const unique = wallets.size;
  const repeat = Math.max(0, logs.length - unique);
  const days = new Set(logs.map(l => l.timestamp.split('T')[0]));

  res.json({
    totalTransactions: logs.length,
    uniqueWalletsCount: unique,
    repeatWalletsCount: repeat,
    activeDays: days.size || 1,
    totalCoinsClaimed: totalCoins,
    sponsorSpendXlm: parseFloat((logs.length * 0.01).toFixed(4)),
    recentTransactions: logs.slice(0, 10)
  });
};

// POST /api/relayer/relay
// Body: { wallet, action, amount }
// Sponsor sends XLM directly to child wallet — no CLI required.
exports.relayTransaction = async (req, res) => {
  const { wallet, action, amount } = req.body;

  if (!wallet) {
    return res.status(400).json({ success: false, error: 'Missing wallet address.' });
  }

  const sponsorSecret = process.env.SPONSOR_SECRET || process.env.STELLAR_MASTER_SECRET;
  if (!sponsorSecret) {
    return res.status(500).json({ success: false, error: 'SPONSOR_SECRET not configured on server.' });
  }

  const sponsorKeypair = StellarSdk.Keypair.fromSecret(sponsorSecret);
  const server = new StellarSdk.Horizon.Server(HORIZON_URL);

  // Coins → XLM: 5 coins = 0.5 XLM, minimum 0.5 XLM
  const coins = parseFloat(amount) || 5;
  const xlmAmount = Math.max(0.5, coins * 0.1).toFixed(7);

  try {
    const sponsorAccount = await server.loadAccount(sponsorKeypair.publicKey());

    // Check if destination account exists on-chain
    let destinationExists = false;
    try {
      await server.loadAccount(wallet);
      destinationExists = true;
    } catch (e) {
      destinationExists = false;
    }

    const txBuilder = new StellarSdk.TransactionBuilder(sponsorAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    });

    if (destinationExists) {
      // Payment to existing account
      txBuilder.addOperation(StellarSdk.Operation.payment({
        destination: wallet,
        asset: StellarSdk.Asset.native(),
        amount: xlmAmount
      }));
    } else {
      // Create account with starting balance (minimum 1 XLM)
      const startBalance = Math.max(1.5, parseFloat(xlmAmount)).toFixed(7);
      txBuilder.addOperation(StellarSdk.Operation.createAccount({
        destination: wallet,
        startingBalance: startBalance
      }));
    }

    const tx = txBuilder.setTimeout(30).build();
    tx.sign(sponsorKeypair);

    const response = await server.submitTransaction(tx);

    saveLog({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      wallet,
      action: action || 'Claim Learning Reward',
      amount: coins,
      xlmSent: xlmAmount,
      txHash: response.hash,
      feeSponsored: 0.01
    });

    return res.json({ success: true, hash: response.hash, ledger: response.ledger });

  } catch (err) {
    console.error('Relay error:', err.response?.data || err.message);
    const detail = err.response?.data?.extras?.result_codes || err.message;
    return res.status(500).json({ success: false, error: JSON.stringify(detail) });
  }
};
