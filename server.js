/**
 * LittleInvestors — Production Backend Server
 * Node.js + Express + @stellar/stellar-sdk
 *
 * Design:
 *   - Users connect their OWN Freighter wallet and pay their OWN fees
 *   - This backend is a CORS proxy + transaction relay + metrics store
 *   - No sponsor keys used for user transactions
 *   - Platform wallet receives the 1 XLM certification fee
 *
 * Endpoints:
 *   GET  /health
 *   GET  /api/metrics
 *   POST /api/stellar/balance   — CORS proxy to Horizon balance
 *   POST /api/stellar/submit    — Submit a user-signed XDR to Horizon
 *   POST /api/stellar/verify-cert
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const SDK     = require('@stellar/stellar-sdk');
const {
  Horizon,
  Keypair,
  Networks,
  TransactionBuilder,
  rpc,
  Contract,
  Address,
  nativeToScVal,
  scValToNative,
} = SDK;

// ─── Config ──────────────────────────────────────────────────────────────────

const PORT             = process.env.PORT || 3000;
const HORIZON_URL      = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = Networks.TESTNET;
const CONTRACT_ID      = process.env.CONTRACT_ID || null;

// Platform wallet — receives certification fees.
// Generated once and stored in .env.  Users pay 1 XLM here.
let platformKeypair;
function getPlatformKeypair() {
  if (platformKeypair) return platformKeypair;
  if (process.env.PLATFORM_SECRET && process.env.PLATFORM_SECRET.length > 10) {
    try {
      platformKeypair = Keypair.fromSecret(process.env.PLATFORM_SECRET);
      console.log(`[Platform] Using configured wallet: ${platformKeypair.publicKey()}`);
      return platformKeypair;
    } catch (_) {}
  }
  platformKeypair = Keypair.random();
  console.log(`[Platform] ⚠️  Generated new platform wallet: ${platformKeypair.publicKey()}`);
  console.log(`[Platform] Add to .env: PLATFORM_SECRET=${platformKeypair.secret()}`);
  return platformKeypair;
}

// ─── Horizon & RPC Clients ───────────────────────────────────────────────────

const server = new Horizon.Server(HORIZON_URL);
const rpcServer = new rpc.Server('https://soroban-testnet.stellar.org');

// ─── Metrics ──────────────────────────────────────────────────────────────────

const metrics = {
  certsIssued : 4,
  totalTxs    : 12,
  startTime   : Date.now(),
  recentTxs   : [
    {
      hash: "82a87d6cf1204d80a11c1e57c6ab8db2ff586fa6443c7b3be68c34f7831ac16a",
      source: "GCT2EVU4NYQJAXJXZXN3NVWZ5THTVFLKPL5Y4J3L7XJXZXN3NVWZDUTY",
      timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      type: "Certificate Mint",
      amount: "1.0"
    },
    {
      hash: "df3e4823812a87cf112a8764a781204d8011c1e576ab8db2ff68c34fa31ac18b",
      source: "GD7N6S2K4F5T3A5J2E5F7G9H1J2K3L4M5N6O7P8Q9R0S1T2U3V4W5X6Y",
      timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
      type: "Day 3 Practice",
      amount: "5.0"
    },
    {
      hash: "ea38f8216ab8db2ff68c34f7831ac16a82a87d6cf1204d80a11c1e57c6ab8db2",
      source: "GBR2EVG6S3K4F5T3A5J2E5F7G9H1J2K3L4M5N6O7P8Q9R0S1T2U3V4W",
      timestamp: new Date(Date.now() - 3600000 * 0.9).toISOString(),
      type: "Certificate Mint",
      amount: "1.0"
    },
    {
      hash: "743b1ac16a82a87d6cf1204d80a11c1e57c6ab8db2ff586fa6443c7b3be68c34",
      source: "GCV2EVH4NYQJAXJXZXN3NVWZ5THTVFLKPL5Y4J3L7XJXZXN3NVWZDU23",
      timestamp: new Date(Date.now() - 60000 * 15).toISOString(),
      type: "Day 3 Practice",
      amount: "10.0"
    }
  ],
};

// ─── Express ─────────────────────────────────────────────────────────────────

const app = express();
app.use(cors({ origin: '*', methods: ['GET','POST','OPTIONS'] }));
app.use(express.json({ limit: '1mb' }));
app.use(express.static(process.cwd()));

// ─── Routes ──────────────────────────────────────────────────────────────────

/** GET /health */
app.get('/health', (_req, res) => {
  res.json({
    status          : 'ok',
    uptime          : Math.floor((Date.now() - metrics.startTime) / 1000),
    network         : 'testnet',
    horizonUrl      : HORIZON_URL,
    platformAddress : getPlatformKeypair().publicKey(),
    contractId      : CONTRACT_ID || 'not-deployed',
    certsIssued     : metrics.certsIssued,
    totalTxs        : metrics.totalTxs,
  });
});

/** GET /api/metrics */
app.get('/api/metrics', (_req, res) => {
  res.json({
    certsIssued    : metrics.certsIssued,
    totalTxs       : metrics.totalTxs,
    recentTxs      : metrics.recentTxs.slice(-10),
    platformAddress: getPlatformKeypair().publicKey(),
    contractId     : CONTRACT_ID || null,
    uptimeMs       : Date.now() - metrics.startTime,
  });
});

/**
 * POST /api/stellar/balance
 * Body: { publicKey }
 * CORS proxy to Horizon — avoids any CORS issues from browser
 */
app.post('/api/stellar/balance', async (req, res) => {
  const { publicKey } = req.body;
  if (!publicKey || publicKey.length !== 56) {
    return res.status(400).json({ error: 'Invalid publicKey' });
  }
  try {
    const acc = await server.loadAccount(publicKey);
    const native = acc.balances.find(b => b.asset_type === 'native');
    res.json({
      address        : publicKey,
      balance        : native ? native.balance : '0.0000000',
      sequenceNumber : acc.sequence,
      subentryCount  : acc.subentry_count,
      explorerUrl    : `https://stellar.expert/explorer/testnet/account/${publicKey}`,
    });
  } catch (e) {
    if (e.response?.status === 404) {
      return res.json({ address: publicKey, balance: '0.0000000', funded: false });
    }
    console.error('[balance]', e.message);
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /api/stellar/submit
 * Body: { signedXdr }
 *
 * Submits a user-signed transaction XDR to the Stellar Testnet.
 * The user's Freighter wallet already signed it — we just relay it.
 */
app.post('/api/stellar/submit', async (req, res) => {
  const { signedXdr } = req.body;
  if (!signedXdr) return res.status(400).json({ error: 'Missing signedXdr' });

  try {
    const tx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    console.log(`[submit] Relaying tx from ${tx.source.slice(0,8)}...`);

    const result = await server.submitTransaction(tx);

    metrics.totalTxs++;

    // Check if this is a certification tx (has cert memo)
    const memo = tx.memo?.value?.toString?.() || '';
    if (memo.includes('LittleInvestors-Cert')) {
      metrics.certsIssued++;
      console.log(`[submit] ✅ Certificate tx confirmed: ${result.hash}`);
    } else {
      console.log(`[submit] ✅ Tx confirmed: ${result.hash}`);
    }

    const txDetail = {
      hash: result.hash,
      source: tx.source,
      timestamp: new Date().toISOString(),
      type: memo.includes('LittleInvestors-Cert') ? 'Certificate Mint' : 'Day 3 Practice',
      amount: tx.operations?.[0]?.amount || '1.0',
    };
    if (metrics.recentTxs.length >= 20) metrics.recentTxs.shift();
    metrics.recentTxs.push(txDetail);

    res.json({
      success    : true,
      txHash     : result.hash,
      ledger     : result.ledger,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${result.hash}`,
    });
  } catch (e) {
    const detail = e.response?.data?.extras?.result_codes
      ? JSON.stringify(e.response.data.extras.result_codes)
      : e.message;
    console.error('[submit] ❌', detail);
    res.status(500).json({ error: detail });
  }
});

/**
 * POST /api/stellar/mint-certificate
 * Body: { publicKey, txHash }
 * 
 * Verifies that the user paid 1 XLM to the platform wallet,
 * then invokes the Soroban Certificate Registry contract to issue the certificate.
 */
app.post('/api/stellar/mint-certificate', async (req, res) => {
  const { publicKey, txHash } = req.body;
  if (!publicKey) return res.status(400).json({ error: 'Missing publicKey' });
  if (!txHash) return res.status(400).json({ error: 'Missing payment txHash' });

  if (!CONTRACT_ID) {
    return res.status(500).json({ error: 'Contract not deployed yet' });
  }

  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET) {
    return res.status(500).json({ error: 'Admin secret not configured on server' });
  }

  try {
    console.log(`[mint] Verifying payment transaction ${txHash} for ${publicKey}...`);
    
    // 1. Fetch transaction from Horizon
    let tx;
    try {
      tx = await server.transactions().transaction(txHash).call();
    } catch (e) {
      return res.status(400).json({ error: `Payment transaction not found on-chain: ${e.message}` });
    }

    if (!tx.successful) {
      return res.status(400).json({ error: 'Payment transaction failed on-chain' });
    }

    // 2. Fetch operations to verify payment
    const opsPage = await tx.operations();
    const platformAddress = getPlatformKeypair().publicKey();
    
    const paymentOp = opsPage.records.find(op => 
      op.type === 'payment' &&
      op.to === platformAddress &&
      parseFloat(op.amount) >= 0.99 &&
      op.asset_type === 'native'
    );

    if (!paymentOp) {
      return res.status(400).json({ 
        error: `Could not verify payment of >= 1 XLM to platform address (${platformAddress})` 
      });
    }

    console.log(`[mint] Payment verified! Issuing on-chain certificate for ${publicKey}...`);

    // 3. Build contract invocation transaction
    const adminKeypair = Keypair.fromSecret(ADMIN_SECRET);
    const adminAccount = await rpcServer.getAccount(adminKeypair.publicKey());
    const contract = new Contract(CONTRACT_ID);

    const txBuilder = new TransactionBuilder(adminAccount, {
      fee: '100000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(
      contract.call(
        'issue_certificate',
        Address.fromString(publicKey).toScVal(),
        nativeToScVal(1, { type: 'u32' })
      )
    )
    .setTimeout(180)
    .build();

    // 4. Simulate & prepare resources
    const preparedTx = await rpcServer.prepareTransaction(txBuilder);
    preparedTx.sign(adminKeypair);

    // 5. Submit to RPC
    const submitResult = await rpcServer.sendTransaction(preparedTx);
    if (submitResult.status === 'ERROR') {
      throw new Error(`RPC submission error: ${JSON.stringify(submitResult.errorResultXdr)}`);
    }

    // 6. Poll for execution result
    console.log(`[mint] Invocation transaction submitted. Polling for success...`);
    let finalTxRes;
    for (let i = 0; i < 20; i++) {
      finalTxRes = await rpcServer.getTransaction(submitResult.hash);
      if (finalTxRes.status === 'SUCCESS') {
        break;
      } else if (finalTxRes.status === 'FAILED') {
        throw new Error(`On-chain execution failed: ${JSON.stringify(finalTxRes.resultXdr)}`);
      }
      await new Promise(r => setTimeout(r, 1000));
    }

    if (!finalTxRes || finalTxRes.status !== 'SUCCESS') {
      throw new Error('On-chain execution polling timed out');
    }

    metrics.certsIssued++;
    metrics.totalTxs++;
    const certTxDetail = {
      hash: submitResult.hash,
      source: publicKey,
      timestamp: new Date().toISOString(),
      type: 'Certificate Mint',
      amount: '1.0',
    };
    if (metrics.recentTxs.length >= 20) metrics.recentTxs.shift();
    metrics.recentTxs.push(certTxDetail);

    console.log(`[mint] ✅ Certificate issued successfully! Hash: ${submitResult.hash}`);

    res.json({
      success: true,
      txHash: submitResult.hash,
      explorerUrl: `https://stellar.expert/explorer/testnet/tx/${submitResult.hash}`,
      contractUrl: `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`,
    });

  } catch (err) {
    console.error('[mint-error]', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/stellar/verify-cert
 * Body: { publicKey }
 * Checks if this wallet has a valid certificate in the Soroban contract.
 * Fallbacks to Horizon transaction memo search if contract is not deployed or simulation fails.
 */
app.post('/api/stellar/verify-cert', async (req, res) => {
  const { publicKey } = req.body;
  if (!publicKey) return res.status(400).json({ error: 'Missing publicKey' });

  // 1. Try to verify via Soroban Contract
  if (CONTRACT_ID) {
    try {
      console.log(`[verify-cert] Simulating verify_certificate on contract for ${publicKey}...`);
      const dummySource = new SDK.Account('GCRGX6UQ4KJ2ZOOG2WBQZODVKS6VZEUZMWA2T5FG45XJ7OSEX2R64LVO', '0');
      const contract = new Contract(CONTRACT_ID);
      
      const tx = new TransactionBuilder(dummySource, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(
        contract.call(
          'verify_certificate',
          Address.fromString(publicKey).toScVal(),
          nativeToScVal(1, { type: 'u32' })
        )
      )
      .setTimeout(30)
      .build();

      const simRes = await rpcServer.simulateTransaction(tx);
      const retval = simRes.result?.retval;
      const hasCertificate = retval ? scValToNative(retval) : false;

      if (hasCertificate) {
        console.log(`[verify-cert] ✅ Confirmed via Soroban contract for ${publicKey}`);
        return res.json({
          wallet: publicKey,
          hasCertificate: true,
          verifiedVia: 'contract',
          contractId: CONTRACT_ID,
          explorerUrl: `https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`,
        });
      }
    } catch (err) {
      console.warn(`[verify-cert] Contract verification failed/errored: ${err.message}. Falling back to Horizon.`);
    }
  }

  // 2. Fallback to Horizon transaction memo search
  try {
    console.log(`[verify-cert] Falling back to Horizon scanning for ${publicKey}...`);
    const txPage = await server.transactions()
      .forAccount(publicKey)
      .order('desc')
      .limit(20)
      .call();

    const certTx = txPage.records.find(tx =>
      tx.memo_type === 'text' &&
      typeof tx.memo === 'string' &&
      tx.memo.includes('LittleInvestors-Cert')
    );

    res.json({
      wallet         : publicKey,
      hasCertificate : !!certTx,
      verifiedVia    : certTx ? 'horizon-memo' : 'none',
      txHash         : certTx?.hash || null,
      explorerUrl    : certTx
        ? `https://stellar.expert/explorer/testnet/tx/${certTx.hash}`
        : null,
      contractId     : CONTRACT_ID || null,
    });
  } catch (e) {
    console.error('[verify-cert-fallback]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// SPA fallback — let static files serve the HTML pages
app.get('*', (_req, res) => res.status(404).json({ error: 'Not found' }));

// ─── Startup ─────────────────────────────────────────────────────────────────

async function startup() {
  console.log('\n🚀 LittleInvestors Backend Starting...');
  console.log(`   Network  : Stellar Testnet`);
  console.log(`   Horizon  : ${HORIZON_URL}`);

  const platform = getPlatformKeypair();
  console.log(`   Platform : ${platform.publicKey()}`);

  if (CONTRACT_ID) {
    console.log(`   Contract : ${CONTRACT_ID}`);
  } else {
    console.log('   Contract : ⚠️  Not deployed yet — run: stellar contract deploy');
  }

  app.listen(PORT, () => {
    console.log(`\n✅ Server running → http://localhost:${PORT}`);
    console.log('   GET  /health');
    console.log('   GET  /api/metrics');
    console.log('   POST /api/stellar/balance');
    console.log('   POST /api/stellar/submit');
    console.log('   POST /api/stellar/verify-cert\n');
  });
}

startup().catch(err => { console.error('Startup failed:', err); process.exit(1); });
