# 🛠️ LittleInvestors — Operations & Monitoring Runbook

This runbook outlines health check monitoring, logging systems, and incident response procedures for the LittleInvestors application and relayer.

---

## 1. Health Monitoring

The platform exposes a standard JSON health check endpoint accessible without authentication:

**Endpoint:** `GET /health`

**Example Response:**
```json
{
  "status": "healthy",
  "uptime": 14205.12,
  "relayerAddress": "GBJLGFJLLNOPTEWVTG3EK7IODVBBGNGQ2A24VGSI5MXS6X5VXSCCNEYG",
  "totalSponsoredTransactions": 46
}
```

**Fields:**
- `status` — `"healthy"` when server is running normally
- `uptime` — Node.js process uptime in seconds
- `relayerAddress` — Sponsor public key derived from `SPONSOR_SECRET`
- `totalSponsoredTransactions` — Count of entries in `transactions.json`

**Frontend Surface:** The Parent Control Center dashboard fetches `/health` and displays the relayer uptime and total transaction count in real time.

---

## 2. Telemetry & Metrics Data Indexing

Activity metrics are aggregated from `relayer/data/transactions.json` on every request:

**Endpoint:** `GET /api/metrics`

**Example Response:**
```json
{
  "totalTransactions": 46,
  "uniqueWalletsCount": 35,
  "repeatWalletsCount": 11,
  "activeDays": 4,
  "totalCoinsClaimed": 230,
  "sponsorSpendXlm": 0.46,
  "recentTransactions": [ ... ]
}
```

**Tracked Fields:**
| Field | Description |
|---|---|
| `totalTransactions` | Total on-chain actions sponsored |
| `uniqueWalletsCount` | Distinct child session wallets |
| `repeatWalletsCount` | Wallets with more than 1 transaction |
| `activeDays` | Unique calendar days with activity |
| `totalCoinsClaimed` | Sum of `amount` across all logs |
| `sponsorSpendXlm` | Estimated XLM spend (`count × 0.01`) |
| `recentTransactions` | Last 10 transactions with wallet, action, hash |

---

## 3. Log File Management

**Transaction Log Path:** `relayer/data/transactions.json`

- New entries are prepended (most recent first) on every `/relay` call.
- Each entry format:
```json
{
  "id": 1719200000000,
  "timestamp": "2026-06-20T10:30:00.000Z",
  "wallet": "GCKYUDH...",
  "action": "Claim Quiz Reward",
  "amount": 5,
  "txHash": "4fa865d...",
  "feeSponsored": 0.01
}
```
- Log file is created automatically if missing on first relay call.
- No log rotation is currently implemented — for production, consider capping at 10,000 entries or migrating to SQLite.

---

## 4. Incident Response

### Incident: `/relay` returning HTTP 500 or Timeout

1. **Check Sponsor Account Balance:**
   - Go to [Stellar Expert Testnet](https://stellar.expert/explorer/testnet) and query the `relayerAddress` from `/health`.
   - If balance < 5 XLM, fund via [Friendbot](https://friendbot.stellar.org/?addr=YOUR_ADDRESS).

2. **Restart the Application:**
   ```bash
   # Railway auto-restarts on failure (restartPolicyType: ON_FAILURE)
   # For manual restart locally:
   npm start
   # Or with pm2:
   pm2 restart littleinvestors
   ```

3. **Check Horizon Status:**
   - Visit [https://horizon-testnet.stellar.org](https://horizon-testnet.stellar.org) to confirm the network is responding.
   - Testnet outages are rare — wait 5 minutes and retry.

### Incident: HTTP 429 Rate Limit Exceeded

- Occurs when a single IP exceeds 100 requests in 15 minutes.
- For legitimate test suites, temporarily increase the rate limit window in `src/routes/route.js`:
  ```js
  windowMs: 15 * 60 * 1000,  // increase to 60 * 60 * 1000 for testing
  max: 100                    // increase limit
  ```
- Reset after testing. Never disable rate limiting in production.

### Incident: Gemini AI Chatbot Not Responding

1. Verify `GEMINI_API_KEY` is correctly set in `src/.env`.
2. Check Google AI Studio for API quota limits.
3. The chatbot degrades gracefully — the rest of the app functions normally without it.

### Incident: Soroban Contract Call Failing

1. Confirm the deployed contract ID is up to date in the parent dashboard configuration.
2. Ensure the parent account is funded and the Freighter wallet is connected.
3. Testnet contracts are ephemeral — redeploy via the Parent Mode "Deploy Smart Vault" button if the contract is no longer active.

---

## 5. Railway Deployment Health

The `railway.json` configures:
- **Builder:** Nixpacks (auto-detects Node.js)
- **Start command:** `npm start`
- **Health check path:** `/`
- **Health check timeout:** 30 seconds
- **Restart policy:** `ON_FAILURE` with max 3 retries

Monitor deployment logs via the Railway dashboard → your project → **Deployments** tab.
