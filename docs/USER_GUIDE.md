# 📘 LittleInvestors — User Guide

Welcome to the LittleInvestors developer and user guide. This document explains how to set up the project locally, run the transaction relayer, and navigate all platform features.

---

## Prerequisites

- **Node.js 18+** (run `node --version` to confirm)
- A **funded Stellar Testnet account** secret key — get one free at [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
- A **Google Gemini API Key** (optional — enables the kid-friendly AI chatbot)

---

## Quick Start (Local Setup)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/thesumedh/Little-Investors.git
cd Little-Investors
npm install
```

### 2. Configure Environment Variables

Create `src/.env`:

```env
PORT=3000
SPONSOR_SECRET=your_testnet_sponsor_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

> **Tip:** Get a free testnet keypair at [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test), then fund it with Friendbot.

### 3. Start the Application

```bash
npm start
```

Open **http://localhost:3000** to access the LittleInvestors educational portal and parent analytics dashboard.

### 4. (Optional) Run the Standalone Relayer

If you want the relayer in an isolated process (port 3001):

```bash
cd relayer
npm install
node index.js
```

---

## User Flows

### 👶 Child Mode — Learning & Earning

1. Navigate to **http://localhost:3000** — the animated landing page.
2. Click **"Start Learning"** to enter the kid dashboard.
3. **Interactive Onboarding Tour** — a 3-step guided walkthrough appears on first visit. Complete it to understand the dashboard layout.
4. Navigate to the **Learn** tab to browse blockchain education modules.
5. Go to the **Quiz** tab — answer questions correctly to earn **Pocket Coins**.
6. When you submit a quiz answer, the gasless reward flow triggers automatically:
   - `Generating wallet key...`
   - `Signing your reward...`
   - `Sponsoring gas on-chain...`
   - `Confirmed! ✅` — with a Stellar Expert link to the live transaction.
7. Check your **Pocket Coin balance** and **Transaction History** on the dashboard.
8. Explore the **Stock Simulator** — buy and sell virtual assets (BTC, ETH, SOL) to practice investing.

### 👨‍👩‍👧 Parent Mode — Vault & Controls

1. From the dashboard, click **"Parent Mode"** (top right corner).
2. Enter the **Parent PIN** (default: `0000`) in the glassmorphic overlay.
3. Inside Parent Mode:
   - Click **"Connect Freighter Wallet"** to link your Freighter browser extension, OR
   - Click **"Generate Local Parent Account"** to use a Testnet-derived key without an extension.
   - Click **"Get Testnet XLM"** to fund the account via Friendbot (one click).
   - Click **"Deploy Smart Vault Contract"** to deploy a Soroban allowance escrow contract for your child.
   - Set **Daily Spending Limits** (enforced on-chain by the Soroban contract).
   - View the **Metrics Dashboard** showing on-chain activity, unique wallets, and sponsor spend.

### 🤖 Gemini AI Chatbot

1. Click the **chat bubble** icon on any page.
2. Ask the AI questions in plain language, e.g.:
   - *"What is a blockchain?"*
   - *"Why does Bitcoin have value?"*
   - *"How does Stellar send money?"*
3. The AI responds in kid-friendly language powered by Google Gemini.

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Landing page |
| `/home` | GET | Kid dashboard |
| `/quiz` | GET/POST | Quiz page + reward trigger |
| `/parent` | GET | Parent mode (PIN-gated) |
| `/health` | GET | Relayer health check |
| `/api/metrics` | GET | Live transaction metrics |
| `/relay` | POST | FeeBump transaction relay |
| `/chat` | POST | Gemini AI chatbot |

---

## Running Tests

```bash
npm test
```

The test suite (`test/*.test.js`) uses Mocha + Chai and covers relay validation, nonce uniqueness, and metrics aggregation.

---

## Deployment (Railway)

The app is configured for Railway deployment via `railway.json`. Push to `main` branch to trigger auto-deployment.

Environment variables to set in the Railway dashboard:
- `SPONSOR_SECRET`
- `GEMINI_API_KEY`
- `PORT` (Railway sets this automatically)
