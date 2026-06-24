# 🔒 LittleInvestors — Security Specifications

LittleInvestors is built on a **non-custodial, zero-trust security architecture** ensuring that child users never handle private keys, while parents maintain full control over their wallets and the platform's sponsor account is never exposed to the client.

---

## 1. Replay Attack Prevention

- Every on-chain transaction request initiated by the browser requires a cryptographically random UUID nonce generated via `crypto.randomUUID()`.
- The Relayer records every processed nonce in `relayer/data/transactions.json`.
- Any request received with a duplicate nonce is immediately rejected with HTTP 409.
- Nonces are single-use and time-scoped to the session.

**Implementation:** `src/controller/stellarRelayController.js` → `/relay` endpoint

---

## 2. Non-Custodial Key Architecture

- Ephemeral child wallet keypairs are generated entirely in the client-side browser using `@stellar/stellar-sdk` standard APIs.
- The private key is stored in the browser's `localStorage` only — never serialised, logged, or transmitted across the network.
- The backend only ever receives and interacts with the **public key address** and **signed XDR** — preserving total non-custodial sovereignty.
- On browser close or localStorage clear, the ephemeral key is discarded. A new session creates a fresh keypair automatically.

---

## 3. Isolated Sponsor Key Management

- The `SPONSOR_SECRET` key (used to sign and fund FeeBump gas sponsorship) is stored exclusively as a **server-side environment variable** (`src/.env`).
- It is never embedded in any frontend EJS template, JavaScript bundle, or public configuration file.
- The `.gitignore` excludes all `.env` files from version control.
- The relayer limits fee-sponsorship to specific learning actions (`Claim Quiz Reward`, `Complete Chore`, `Claim Learning Reward`) to prevent sponsorship abuse.

---

## 4. Rate Limiting

- The Express application applies rate limiting to all relay and API endpoints via `express-rate-limit`.
- **Limit:** 100 requests per 15-minute window per IP address.
- Threshold violations return **HTTP 429 Too Many Requests**.
- This prevents bot abuse and protects the sponsor account XLM balance from being drained.

**Configuration:** `src/routes/route.js`

---

## 5. Parent PIN Authentication

- The Parent Control Center (`/parent`) is protected by a PIN-based authentication overlay.
- Default PIN: `0000` (configurable by the parent).
- The PIN is validated client-side with the glassmorphic overlay preventing DOM access until correct entry.
- All Soroban smart vault operations require `parent.require_auth()` — the Stellar network enforces parent wallet signatures on all limit-setting and deployment operations.

---

## 6. Environment Isolation

- `src/.env` is excluded from version control via `.gitignore` and `.dockerignore`.
- A `.env.example` template is provided with placeholder keys for setup guidance.
- Docker and Railway deployments inject secrets as environment variables — never baked into the image.

---

## Security Checklist Summary

| Control | Status |
|---|---|
| Replay nonce protection | ✅ Implemented |
| Non-custodial key generation | ✅ Implemented |
| Private key never transmitted | ✅ Implemented |
| Sponsor secret server-only | ✅ Implemented |
| Rate limiting (100/15min) | ✅ Implemented |
| Parent PIN gate | ✅ Implemented |
| Soroban `require_auth()` | ✅ Implemented |
| `.env` excluded from git | ✅ Implemented |
| No hardcoded secrets in frontend | ✅ Implemented |
