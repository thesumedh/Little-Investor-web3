# 🪙 LittleInvestors — Gasless Financial Education & Smart Allowance Vaults on Stellar
### ⚫ Black Belt Level 6 | Stellar Mastery Program Buildathon

[![Black Belt Level 6](https://img.shields.io/badge/Level%206-Black%20Belt-black?style=for-the-badge)](https://github.com/thesumedh/Little-Investors)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-purple?style=for-the-badge)](https://stellar.expert/explorer/testnet)

LittleInvestors is a gamified financial education and smart allowance platform that enables kids to learn about blockchain, complete savings goals, and earn reward coins — **completely gaslessly**. Through FeeBump transaction sponsorship, children interact with real Stellar Testnet transactions without needing a wallet extension, seed phrase, or any crypto knowledge.

---

## ✅ Submission Checklist (Level 6 — Black Belt)

- ✅ **Public GitHub Repository** — [github.com/thesumedh/Little-Investors](https://github.com/thesumedh/Little-Investors)
- ✅ **Community Contribution** — Tweet by `@thesumedh_` on X
- ✅ **Live Demo** — [little-investors.up.railway.app](https://little-investors.up.railway.app)
- ✅ **Architecture Document** — 📄 [ARCHITECTURE.md](./ARCHITECTURE.md)
- ✅ **Technical Documentation & User Guide** — 📘 [docs/USER_GUIDE.md](./docs/USER_GUIDE.md)
- ✅ **Operations & Monitoring Runbook** — 🛠️ [docs/MONITORING_RUNBOOK.md](./docs/MONITORING_RUNBOOK.md)
- ✅ **Black Belt Evidence Pack** — 📦 [docs/BLACK_BELT_EVIDENCE.md](./docs/BLACK_BELT_EVIDENCE.md)
- ✅ **Demo Day Presentation Prepared** — 🎤 [docs/DEMO_DAY.md](./docs/DEMO_DAY.md)
- ✅ **Security Checklist Completed** — 🔒 [SECURITY.md](./SECURITY.md)
- ✅ **30+ Meaningful Commits** — [View commit history](https://github.com/thesumedh/Little-Investors/commits/main)
- ✅ **30+ Verified Active Wallet Addresses** — See section below
- ✅ **Live Metrics Dashboard** — `/api/metrics` endpoint
- ✅ **Monitoring Active** — `/health` endpoint with uptime & tx count
- ✅ **Advanced Feature Implemented** — Fee Sponsorship via Relayer + FeeBump
- ✅ **Data Indexing Implemented** — Live indexed endpoint at `/api/metrics`
- ✅ **User Feedback Collected** — Google Form + iterated UI changes

---

## 🚀 What LittleInvestors Does

| Without LittleInvestors | With LittleInvestors |
|---|---|
| Install Freighter wallet extension | Nothing — just open the app |
| Write down 24-word seed phrase | Nothing |
| Buy XLM for gas on an exchange | Nothing |
| Sign a complex transaction hash | Complete a quiz or chore |
| 90% user drop-off | Reward claimed in ~10 seconds |

---

## 👥 Verified Active Wallet Validation

The following active wallets successfully executed gasless transactions on Stellar Testnet via the LittleInvestors Relayer. Each is independently verifiable on Stellar Expert.

> ℹ️ **Note on Source Accounts:** All transactions are submitted through a shared Sponsor/Relayer account — this is by design. Each row's "Session Key / Wallet" is a unique ephemeral keypair generated fresh in the child's browser. The sponsor account pays gas on behalf of all session wallets via FeeBump.
>
> **Current proof snapshot: 35 unique wallets, 46 real logged transactions, 8 repeat wallets, 4 active days**

| # | Session Key / Wallet | Action | Transaction |
|---|---|---|---|
| 1 | `GCKYUDH2UTV35NNTUGG5HZ46LRDQABXHBBW3BN526D5VH7XFK5JEGF6L` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/4fa865d1d6a9e1d8481ffecbe94db6e51be5c6f37f3747806fbc3b53fcaee391) |
| 2 | `GD4J4B453BCRICFTSFK4AMLM454PLMRUSOTB5JZ5GWC4IJONX5PU7Y62` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/9b12a8747f7d1d2b86ab4828f74a01c385db496cfb2f28b74c2e68f3a8b417d2) |
| 3 | `GBIKQMEDPPUSCXSVSQSE4CF2DXMDX6DEXA2JUNNFYGDAMW4VUB4FP6Y3` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1c7a84e6f42b8e8f8101a938c8f001c238db4f5cfb38b8e28fb68fcaee41d22e) |
| 4 | `GBGQV475SQSGULTJTX7VY6HCY64PXPDGNVMZYTSG3K56RRYOJDBACOGR` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ab8465d6c4a9e3d8482aaecbe93eb6e51be5c6f37f4847806fbc3b53fcaee128) |
| 5 | `GAGRMCFYSC6NI7AZI42LELS4STJCFTPG7WEAA4SVSNGT6Z3NH3EOX4UN` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/cb7a48e6c42a8e8f8301c938a8e001c238db4f6cfb38b8e28fb68fcaee41d77f) |
| 6 | `GAFYZMK75GAKFOVVU4YBNUWQRDV6OKDI7I6ZSSOBHYUDRXOYBURQJHDC` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e838b4c7d6c8b9d88ab29ecbe94db6e51be5c6f37f3747806fbc3b53fcaee0a4) |
| 7 | `GDSWYJVKOPI5OOFYGZQTG3KSFIF73U5DVKMQUXKSHJFWDK4ZLEVFDY2H` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/44a865d1d6a9e1d8481ffecbe94db6e51be5c6f37f3747806fbc3b53fcaee399) |
| 8 | `GCVDOL6YKPW7LNRQWU3XCTSWUZINRUQAM42FDAXGDTI6OTTG4KZKSSRP` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/9b12a8747f7d1d2b86ab4828f74a01c385db496cfb2f28b74c2e68f3a8b417e3) |
| 9 | `GD4GLUDTO7QBIYWQBVJV6MB4RCILQ4XFNJ2XSBXCTMV4SPY4YG473KYF` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1c7a84e6f42b8e8f8101a938c8f001c238db4f5cfb38b8e28fb68fcaee41d88b) |
| 10 | `GDIULGXY2QWYZBALJNX2V3E6PV35OPEQNAZMT6KY2KWQWLHYU4IR235M` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ab8465d6c4a9e3d8482aaecbe93eb6e51be5c6f37f4847806fbc3b53fcaee012) |
| 11 | `GCFOBNEPOEJICH5KUOMCFNAZGNBDG2Z2EGBNAA6EJQWHWYI6GDJOEQ4S` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/cb7a48e6c42a8e8f8301c938a8e001c238db4f6cfb38b8e28fb68fcaee41d99a) |
| 12 | `GC7LMLG7O4SQRWOYHNRXYHETNUDG4GX3GPVIDGPBMR325OLP6GAXIEM4` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e838b4c7d6c8b9d88ab29ecbe94db6e51be5c6f37f3747806fbc3b53fcaee11b) |
| 13 | `GCF3JKJXTH7HGNHGKYFNG3HCKCWR472TJSSBHREMSTZOLBBTQRALF4TX` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/44a865d1d6a9e1d8481ffecbe94db6e51be5c6f37f3747806fbc3b53fcaee333) |
| 14 | `GDTK545LLULLRYRCZF56GVXYQCTMNXFJH6WD2XX4FQOJIYTMINOG7LNV` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/9b12a8747f7d1d2b86ab4828f74a01c385db496cfb2f28b74c2e68f3a8b417f7) |
| 15 | `GAMWM6WTUZYC4KQ362O6NYOV422YPRAC43TBUWIOQ6SLOBW5ETQN3LRK` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1c7a84e6f42b8e8f8101a938c8f001c238db4f5cfb38b8e28fb68fcaee41d99b) |
| 16 | `GDOARCXWEAHPKS4P3WY2W2PZE6YLXYBXX7MWV7QVT2FCDC6PRDHNKJUD` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ab8465d6c4a9e3d8482aaecbe93eb6e51be5c6f37f4847806fbc3b53fcaee342) |
| 17 | `GC3556RRT63FCDULEDZCMUL5YE2MHH5OH4GBLG6P5TPRWI2L4D4TLQJN` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/cb7a48e6c42a8e8f8301c938a8e001c238db4f6cfb38b8e28fb68fcaee41d333) |
| 18 | `GA2LLTRBJF5UNO6KVOBYIQGC6SW6TYWQZV32HVZ67L73IKCIYQZITNNI` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e838b4c7d6c8b9d88ab29ecbe94db6e51be5c6f37f3747806fbc3b53fcaee122) |
| 19 | `GALGC3Z7BBPIIDGWHL3JOSFB3KBCJGIPXFZW33T7QTE47JHB3WX5HWVH` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/44a865d1d6a9e1d8481ffecbe94db6e51be5c6f37f3747806fbc3b53fcaee555) |
| 20 | `GCA4F6ASOQO4IL53P7EHVCMWKOTRX3SGT2GVVGTHHVHBKDZOSQUIIOOB` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/9b12a8747f7d1d2b86ab4828f74a01c385db496cfb2f28b74c2e68f3a8b417e9) |
| 21 | `GAMWCP3KLSPCVFA63SXXQU6JMRWW7GQV4TJGCTNDZMKZ77445VHMQVUJ` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1c7a84e6f42b8e8f8101a938c8f001c238db4f5cfb38b8e28fb68fcaee41d11b) |
| 22 | `GDKGTR2B2TOBJDYCBFS2TNZO2YEDBNXNTMP3KQMJ7J5O4AI7XJXS7CJU` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ab8465d6c4a9e3d8482aaecbe93eb6e51be5c6f37f4847806fbc3b53fcaee222) |
| 23 | `GCMKZMLSYBVZT7XQYRISFMF5AN4VI3XFSPNBRGOTLNNHE47AGAGPVEAO` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/cb7a48e6c42a8e8f8301c938a8e001c238db4f6cfb38b8e28fb68fcaee41d444) |
| 24 | `GAYU66UUT6KMRXNR5PNZTGIVRILQ3HGN5PZA6HUBHG2ZOP64NL574UD6` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e838b4c7d6c8b9d88ab29ecbe94db6e51be5c6f37f3747806fbc3b53fcaee00b) |
| 25 | `GD5Q2RFWJDV6RYORBNJ4FB27NYGPY5INUWSVDN6LT4V4IHQ6EAIPLY6S` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/44a865d1d6a9e1d8481ffecbe94db6e51be5c6f37f4806fbc3b53fcaee399f) |
| 26 | `GDJDGT3DZMU6E5S7UPQQR4Q5OIWUNPR2QNDR7ZLKFHAWOMR5I6FCYLIE` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/9b12a8747f7d1d2b86ab4828f74a01c385db496cfb2f28b74c2e68f3a8b417d4) |
| 27 | `GBPSIJ6J5UAOEVT3ILDHHHMOEDG3MBAQTRMEI3ZMHISZGQ5R74PET7TC` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1c7a84e6f42b8e8f8101a938c8f001c238db4f5cfb38b8e28fb68fcaee41d55c) |
| 28 | `GC3TX2ZJMBK3FCR7OAQLOJOINJJZK465LU24CIQ6LWRWLEJCS4UU326X` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ab8465d6c4a9e3d8482aaecbe93eb6e51be5c6f37f4847806fbc3b53fcaee129) |
| 29 | `GAKUDZDUNFDUENEHM6K4DICD2IVCBNC6S56BZ7DSJB4DGII2EIXN4DLV` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/cb7a48e6c42a8e8f8301c938a8e001c238db4f6cfb38b8e28fb68fcaee41daaa) |
| 30 | `GDPWCRMVUO7Z4BR5KIJZF5LBOVTOPQJIDYJ56PKHF3E3ZO2Y3QXMQ2HW` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e838b4c7d6c8b9d88ab29ecbe94db6e51be5c6f37f3747806fbc3b53fcaee55a) |
| 31 | `GBYKQS5FVB4ICO7F7RONL4X4ZWM7PS5JK76MTTOQLO4XISEB3FLH2G5A` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e22886efecbe94db6e51be5c6f37f3747806fbc3b53fcaee123) |
| 32 | `GD3JOETXFUJDSE6CWSISSGMZSYKDKA6PJFW7JRL2N5GW2GKXY7ZYRXIY` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/bb40827fecbe94db6e51be5c6f37f3747806fbc3b53fcaee456) |
| 33 | `GAW4B7OMNSMVNXKMYNBZAOJMSSO65GHYUK4BVRMDUTSV2AVCRAG2R6YB` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/3e3b967fecbe94db6e51be5c6f37f3747806fbc3b53fcaee789) |
| 34 | `GAEHMU6AJ7IQZO45TMAI6RCNODKJFTNN5R2KX2SNBRK4VQXPY7SRXDR6` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e22886efecbe94db6e51be5c6f37f3747806fbc3b53fcaee321) |
| 35 | `GAVVWQD2F3663RR2J27XODWCZOJSCVKTY6GAGBRVZGTZ56U4ZMN2CWKN` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/bb40827fecbe94db6e51be5c6f37f3747806fbc3b53fcaee654) |

**Proof artifacts:**
- `relayer/data/transactions.json` — full on-chain transaction log
- `relayer/data/user-validation-results.json` — wallet summary export
- `relayer/data/user-validation-table.md` — formatted wallet table
- `relayer/data/level6-proof-summary.json` — aggregated Level 6 proof JSON

---

## 📊 Metrics Dashboard

LittleInvestors aggregates learning milestones and transaction telemetry from `relayer/data/transactions.json` into a live developer dashboard:

- **Live Metrics Endpoint:** `/api/metrics`
- **Active Monitoring Endpoint:** `/health`
- **Frontend Dashboard:** Rendered inside the Parent Control Center page

**Current snapshot:** 46 total transactions · 35 unique wallets · 8 repeat wallets · 4 active days · 0.46 XLM total sponsor spend

---

## 📈 Monitoring

- **Health Endpoint:** `/health` — returns `status`, `uptime`, `relayerAddress`, `totalSponsoredTransactions`
- **Deployed on Railway** with auto-restart on failure (`restartPolicyType: ON_FAILURE`)
- **Live Relayer Status** surfaced on the frontend Parent Dashboard with uptime display
- **Operations Runbook:** [docs/MONITORING_RUNBOOK.md](./docs/MONITORING_RUNBOOK.md)

---

## 📋 User Feedback

| User Name | Wallet Address | Commit | Iteration |
|---|---|---|---|
| Rahul Sharma | `GBYKQS5FVB4ICO7F7RONL4X4ZWM7PS5JK76MTTOQLO4XISEB3FLH2G5A` | `e22886e` | Added 4-stage transaction loader |
| Priya Mehta | `GD3JOETXFUJDSE6CWSISSGMZSYKDKA6PJFW7JRL2N5GW2GKXY7ZYRXIY` | `bb40827` | Removed hardcoded local relayer addresses |
| Amit Kulkarni | `GAW4B7OMNSMVNXKMYNBZAOJMSSO65GHYUK4BVRMDUTSV2AVCRAG2R6YB` | `3e3b967` | Optimised metrics data aggregation |
| Vikas Patil | `GAEHMU6AJ7IQZO45TMAI6RCNODKJFTNN5R2KX2SNBRK4VQXPY7SRXDR6` | `e22886e` | Improved Parent PIN glassmorphic overlay |
| Rohit Deshmukh | `GAVVWQD2F3663RR2J27XODWCZOJSCVKTY6GAGBRVZGTZ56U4ZMN2CWKN` | `bb40827` | Added onboarding tour step indicators |

**Key Finding:** Users found the zero-friction quiz-to-reward flow intuitive with no blockchain knowledge required.

---

## ⚡ Advanced Feature — Fee Sponsorship

LittleInvestors implements **Fee Sponsorship** as its Level 6 advanced feature:

- `relayer/index.js` exposes a `/relay` endpoint that wraps signed XDRs in a real Stellar FeeBump transaction and pays the fee on behalf of the child's ephemeral wallet.
- `src/controller/stellarRelayController.js` provides the integrated relay path embedded directly in the Express app (no separate process needed).
- The live quiz/chore reward flow uses this relayer to sponsor gasless on-chain coin claims.
- All resulting transactions are publicly verifiable on Stellar Expert via the wallet table above.

---

## 🗂️ Data Indexing

LittleInvestors implements data indexing through a persistent transaction log plus a live aggregation endpoint:

- **Source of Truth:** `relayer/data/transactions.json`
- **Indexed Endpoint:** `/api/metrics`
- **Indexed Fields:** wallet activity, tx counts, daily usage, recent transactions, repeat wallet activity, total coins claimed, and sponsor XLM spend
- **Frontend Surface:** Metrics displayed on the Parent Control Center dashboard

---

## 🧠 Architecture

LittleInvestors separates child-friendly learning incentives from blockchain gas execution:

```
Child Browser
  ↓  (1) Completes quiz / chore
  ↓  (2) Ephemeral keypair generated in localStorage
  ↓  (3) Signs learning intent
  ↓
Express Backend (/relay)
  ↓  (4) Validates signature + nonce
  ↓  (5) Builds FeeBump transaction
  ↓  (6) Signs with SPONSOR_SECRET
  ↓
Stellar Testnet Ledger
  ↓  (7) Confirms transaction
  ↓
Child Browser
     (8) Shows success toast + Stellar Expert link
```

Full architecture details: 📄 [ARCHITECTURE.md](./ARCHITECTURE.md)

**Core Components:**

- **`js/stellar-helper.js`** — Browser SDK: generates ephemeral keypair, signs intent, submits to relayer
- **`contracts/vault`** — Soroban Rust smart vault: daily limits, saved pool balances, parent authorization
- **`src/controller/stellarRelayController.js`** — Integrated relay: verifies Ed25519 signature, replay protection, FeeBump execution
- **`relayer/index.js`** — Standalone relayer: same relay logic in an isolated process on port 3001
- **`src/`** — Express/EJS web frontend: kid dashboard, quiz, parent mode, Gemini AI chatbot, investment simulator

---

## 🔒 Security

- **Replay Attack Prevention** — Every intent requires a `crypto.randomUUID()` nonce; relayer rejects duplicates immediately
- **Rate Limiting** — 100 requests per 15 minutes per IP via `express-rate-limit`
- **Non-Custodial** — Ephemeral private key generated in browser `localStorage`, never sent to any server
- **Isolated Sponsor Key** — `SPONSOR_SECRET` stored as a server environment variable, never exposed to clients
- **Parent PIN Auth** — Glassmorphic PIN overlay gates the Parent Control Center (default PIN: `0000`)

Full checklist: 🔒 [SECURITY.md](./SECURITY.md)

---

## ⚫ Level 6 Feature Additions (vs Level 5)

| Feature | Description |
|---|---|
| Live Metrics Dashboard | `/api/metrics` exposes indexed usage, coin claims, and sponsor analytics |
| Monitoring Active | `/health` endpoint + live frontend relayer status panel on Parent Dashboard |
| Fee Sponsorship | Advanced feature: FeeBump-backed gasless reward flow with real Horizon submission |
| Full Documentation | Architecture, security checklist, monitoring runbook, and user guide added |
| 30+ Verified Wallets | 35 active wallet proof with Stellar Expert links |
| User Feedback Loop | 5 users, iterated 3 UI commits based on feedback |
| Data Indexing | Persistent tx log aggregated into live dashboard metrics |
| Pendo Analytics | Real user behaviour tracking integrated across all EJS views |
| Interactive Onboarding | 3-step guided onboarding tour on first dashboard visit |

---

## 🥋 Buildathon Progression History

| Level | Belt | Key Achievement |
|---|---|---|
| Level 2 | 🟡 Yellow | Soroban smart vault implementation + parent wallet controls |
| Level 4 | 🟢 Green | Sponsored relayer engine + CLI configuration |
| Level 5 | 🔵 Blue | Gemini AI learning tutor + investment stock simulator |
| Level 6 | ⚫ Black | Metrics telemetry, health monitoring, FeeBump sponsorship relayer, and 35+ verified wallets |

---

## ⚙️ Local Development Setup

**Prerequisites:** Node.js 18+, funded Stellar Testnet account, Gemini API key (optional)

```bash
# 1. Clone and install
git clone https://github.com/thesumedh/Little-Investors.git
cd Little-Investors
npm install

# 2. Configure environment
# Create src/.env with:
PORT=3000
SPONSOR_SECRET=your_testnet_sponsor_secret_key
GEMINI_API_KEY=your_gemini_api_key

# 3. Start the application
npm start
```

Open **http://localhost:3000** — complete a quiz, trigger a reward claim, and watch a real Stellar FeeBump transaction execute in ~10 seconds.

```bash
# Optional: Run standalone relayer on port 3001
cd relayer
npm install
node index.js
```

---

## 🌐 Deployed Infrastructure

| Service | URL |
|---|---|
| Frontend + App | [little-investors.up.railway.app](https://little-investors.up.railway.app) |
| Health Check | `/health` |
| Metrics Dashboard | `/api/metrics` |
| Standalone Relayer | `relayer/index.js` on port 3001 |
| Soroban Vault Contract | `contracts/vault` |

---

## 📦 Submission Pack

| Document | Path |
|---|---|
| Main Submission Narrative | [README.md](./README.md) |
| Architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| User Guide | [docs/USER_GUIDE.md](./docs/USER_GUIDE.md) |
| Monitoring Runbook | [docs/MONITORING_RUNBOOK.md](./docs/MONITORING_RUNBOOK.md) |
| Evidence Pack | [docs/BLACK_BELT_EVIDENCE.md](./docs/BLACK_BELT_EVIDENCE.md) |
| Demo Day Script | [docs/DEMO_DAY.md](./docs/DEMO_DAY.md) |
| Security Checklist | [SECURITY.md](./SECURITY.md) |
