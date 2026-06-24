# 🪙 LittleInvestors — Gasless Financial Education & Smart Allowance Vaults on Stellar
### ⚫ Black Belt Level 6 | Stellar Mastery Program Buildathon

[![Black Belt Level 6](https://img.shields.io/badge/Level%206-Black%20Belt-black?style=for-the-badge)](https://github.com/thesumedh/Little-Investor-web3)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-purple?style=for-the-badge)](https://stellar.expert/explorer/testnet)

LittleInvestors is a gamified financial education and smart allowance platform that enables kids to learn about blockchain, complete savings goals, and earn reward coins — **completely gaslessly**. Through FeeBump transaction sponsorship, children interact with real Stellar Testnet transactions without needing a wallet extension, seed phrase, or any crypto knowledge.

---

## ✅ Submission Checklist (Level 6 — Black Belt)

- ✅ **Public GitHub Repository** — [github.com/thesumedh/Little-Investor-web3](https://github.com/thesumedh/Little-Investor-web3)
- ✅ **Community Contribution** — Tweet by `@thesumedh_` on X
- ✅ **Live Demo** — [little-investors.up.railway.app](https://little-investors.up.railway.app)
- ✅ **Architecture Document** — 📄 [ARCHITECTURE.md](./ARCHITECTURE.md)
- ✅ **Technical Documentation & User Guide** — 📘 [docs/USER_GUIDE.md](./docs/USER_GUIDE.md)
- ✅ **Operations & Monitoring Runbook** — 🛠️ [docs/MONITORING_RUNBOOK.md](./docs/MONITORING_RUNBOOK.md)
- ✅ **Black Belt Evidence Pack** — 📦 [docs/BLACK_BELT_EVIDENCE.md](./docs/BLACK_BELT_EVIDENCE.md)
- ✅ **Demo Day Presentation Prepared** — 🎤 [docs/DEMO_DAY.md](./docs/DEMO_DAY.md)
- ✅ **Security Checklist Completed** — 🔒 [SECURITY.md](./SECURITY.md)
- ✅ **30+ Meaningful Commits** — [View commit history](https://github.com/thesumedh/Little-Investor-web3/commits/main)
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
| 1 | `GCRMAPWO7VEDLDRPUDL3VUC5446AQFOCH6ULISWNKBNCHVFSJDI7ETKI` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/d7b3afad521356146b87f6d1217f90b24f73e481e279ae9d642e47df8b0978b9) |
| 2 | `GASW7UAMVMTDV66STNYWV5TNESRFXQR5GGVSWDOYKJIVLDBDECPYCAJV` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/92eb6db3d5d26752a3b2a18542a77e9bd660a1fe12f4a277d7c2efde2285f7b5) |
| 3 | `GC75DHPKMQCS3V6LS4WQT2RLUMHF3NLXIXPEIZIA72OSLASMMXXXAFBX` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/0ef81545803a4fa73ace473f62422c783b6a473aedd222db979447cf08673699) |
| 4 | `GDBYGLSPIZMHYFCWYAFXFJMWQCC675NAJU2XTF24KNXQZEKQHXOWLUW7` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1c0fa2667659f49f2c282679a599ddc5170ae4a9c0131b0b9f89e42c80620018) |
| 5 | `GA3PNJCAP7ONEEMW6YFDQKOPZQCYOJ6HNUBAMP5UE5J25Y6BNT4LNNLE` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/621e42dd3370fc0a41ee150fa972b87929b614c3911ec544f9f01e5958d2bac5) |
| 6 | `GASVJ7Y4FFDE3XXJYDO2MSUCFRN4IIY3YMJEXYC62TP26CDSCLM7VW5S` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/cfe1d4258d1a8650985e3be8e0322b28248f625edd9c6357f188956b6dd93de3) |
| 7 | `GDNF5AB7GPIEZ2EGNL7KRQ72WES6ZTT2MKS3CF3UDMLH35O7BVWILKZZ` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/a4ec0d495245dd63c64d53aa9ef431ee46a266b40cb1fdec2282bc891ecaee4b) |
| 8 | `GDLLO43HZBFNVFKXZRFZIGF6IIMIA2VZZKKEDXKLJVN3XF6DIZUILMV5` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/5aae721547b4fa2907a74aafa94865ac26185c7b32a038d8d6dc849760812e52) |
| 9 | `GC77UWIRE7EVL3TGOCRVIYVOWT7QZAPZQ5VPEI7FJWXXIH4ZQ4DTKMJR` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/d03164217079640d63e20a7b34d83b4de261b7e2a054ec808171ebfcd6e52193) |
| 10 | `GAG3CCQKBIIVT32YUQMT5M3HWHCSUWU4O7EABL273KUO2UZ77D4HUBCW` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/e22788d4b7a080e4290a6411d25bbb7a520a61674b9398e01111b196891f0c36) |
| 11 | `GDBMD22EKIONA3EZRC4JWOUUZE637MWU6OEG3GUSUJXHEMUS4JBO7IXG` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/f1e6c62a5b8f4d8b55ac4135165e04ec028ce2c814aeff23436959484affc799) |
| 12 | `GAFAPJZWJFLJCW3DIBRKX3EQEBQEBUH3T4C3OVHED33ASO5IXLC4Q4VG` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/18c137d4e143e7a9459532216aa44d54852cc5f05a12a502cc4bb5bb2ca8174c) |
| 13 | `GDSVIQZYESY6QPRJWWWWEBZ4INGYVUIZSC3LHCTNIKXGPLSWVMOR3RGU` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/44e5ded9b2b4dad56f39f48dd940af279d22acc425e3f9654ee029e64b843fc8) |
| 14 | `GDURYAYNPWHFJIZQWO6CPUPLU2BEV7TPZCLGCOOXHWNFBU5BGD5W2XBA` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8b44ef16528a33d9df4fd4aace27314569cc4ce5e8f47fe6db0804d4615a2345) |
| 15 | `GDWCAFQXYTH7X5NSJPW3JSSGDN7V6OB3GB4LUZ6SSV2MPFLN4GGGVJKO` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/beef826d27f515de7a09b71e4e471bdf91c0fa015c3bac81a9732157f1277589) |
| 16 | `GAMMB7OSG4GNS7LDBGTHZR3W7FZIVLDZ5Z3NNCIJANL34L6FCBSFOAIT` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/108b5fbe3d9f15f04811c47b84234dbb16553c30a1bc82d2e129151edbb00296) |
| 17 | `GALGNMB27YTR4PEHGQZUQXJ4PIOLSLHKE7AKTLYGNNSMMJ4B5L2F4PBJ` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c711d0aae88f49de6de7045ac45c2a57021b7a8436c31e84c3c5b7c78eedc8e0) |
| 18 | `GDOY2HWHF2DLVGFY67WX2YU3HQAKAA2QSMTLAGB42OJITGW3VMQ3LNRA` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/ea22db46e7abe8fb271ef10aabc49dce3b39e45a9380f60f47a9a9d38dc37ec9) |
| 19 | `GDLJHHVJOP4GCQU6O73KWUKM65AO4KB62Z55TRPSKY73AQJEN3YMDJQJ` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/f48d9ca0c5e009c750dfa03259eb3e9bb3f3cbc225eaf0b0440a1ad6a7912cdc) |
| 20 | `GB4C657QN37DQ3ESMTLVUMGMAB56PI2OEOIKL4GJDTL6OVLDICPVJZ3K` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/4cc576c77bcdbdebf7f4126df07491eb7f6df0fafc00c2edc7aec8dd9beed012) |
| 21 | `GB4GAXSOOXWOYHONVROU6DKFBR4Y332T2AXCHPJXMXHKJTIHJOJH25RL` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c1d26d3d7a3e8c4ee15695a395922dc6d6096b45b32b06b16450d504235010c2) |
| 22 | `GCI24GVLWL5W26EL362YDYIYGPMS53FBQELQ4FTTM4SCLRTOZMEZMDVL` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/d49ac50a130db3a05a95299ff27d90362f621fbc0fbdb7f43b98cad0607514b5) |
| 23 | `GCIEEPONVCJ4FCEVNLXRS2MUPLMXV2V4S26CPLZD6RAXTURZ5J5PHZYF` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/001c389c2075d7d1fe9c0a1be95a7b389a6a16d41b4f7904100265efd66ebc76) |
| 24 | `GCBO3DAUDGW5CGPF6TKGHJBQRR33LQHQ6P56T56UGYHUIHAJMASE4AW6` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/a7fa4674cf98245be2d8fd01e12d0b23580da1418a3f96ea24586ddf49011edd) |
| 25 | `GDRDLX43KTPPXEEGBYQMDFNCMMFRNEZZ3J5EBQCDIANEP4EBPRPKPNRJ` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/a0c18498692005e90b2efea7e15f1ee4486459070d8ba53a5ffd9c8bf595d7f3) |
| 26 | `GDF7ACL536ZQP67MBTC5QURO66DPFKCR3ABRJNY7LVH54AXKIVWVMYK7` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8d7c3df2e48354904eeb30c93a0baded8987aac74eef27376382e742eae0e03c) |
| 27 | `GBMEQKQAEHGUGDKCXWLZANNFWSJN2DDPOZN5N77EXO6BIJKPLHPDC6K3` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/387666572ac165c432b16902409a6e492c0f17ed0228b64e9e738108e2767706) |
| 28 | `GCGJWFKOAUMI3JMYLS23TPWX3BSCOYKIB3OQBGB3WQ5PHFKTBLREPVKE` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/a06fce1900226c6c6a55a0eb1e84ef9799b216b95d4e2e0c6c58ca38d6783434) |
| 29 | `GAH4LFKMZRSZ6RXSSYHK36IWFQVVJ4QX3WYP6L3BEABDK52T4OLRRIGD` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/c307217cfa90d2fa1dd9d7685e12b7bfe237dd4f3ecf6b754e010001e0b4662f) |
| 30 | `GBCM6TJX7UETY2OR7QGNS2H4HABKXXKLNLHVUHSYCOBOJO35QOYOPW3Q` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/3b6f4c11d34063aa2162d86169237e2e238c64eb9e3e057f3955ff8b3713fd38) |
| 31 | `GB6PTIN4N7FVBBRTQF7JE3DUVDNOFVDTDA5NYRV6RHGF7NGTC4TWLUYG` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/900b47272d0c2b87353accbdc217a218382a76f8edc8698058dd4fd8635d4fc3) |
| 32 | `GD3E7HL53ZN2PBESVL2GWZ2AN5TUISVGP456RYCADZBPUGZK6BUY5QM3` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/8286c937482d9c0c74cf917f15e1472a9db34549a04386453fc60629b7a8a264) |
| 33 | `GCGTKJYVXKOP5RWIVYPRRTBS3PQAZKWCZQ64TNNNADS7KE63UHVIHMTZ` | Complete Chore | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/7031fe4fc1a22666d9fa842edad6649921b88519ff8c4568cbaa8c6b1d5d643a) |
| 34 | `GAXUGB65KHA7FQIXL6C633HN2AV4VEXOP5T3YDB56KTBIDSDAIEEWSGY` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/1377af95bfb9fa8c6f0f2406e015a8dac9adecd36b1b4b075f0d3aabf2b66987) |
| 35 | `GAX5SZGME6ZHFBEBK4DDCAGT7R62YCGAOPJGLI2FSSHH4HZLL6SUBNYX` | Claim Quiz Reward | [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/0aeb4dbc025a4f3f36b6baf9121e1358e8b210f4d0fed8106eee7d15b7373f1d) |

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
