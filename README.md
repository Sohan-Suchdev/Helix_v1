# 🧬 Helix DeSci Protocol

**Unlocking the $100B+ XRP Ecosystem to Bridge the £180M "Valley of Death" in Medical Research.**

Helix is an Prediction Markt on the Flare Network. We aggregate distributed expertise to identify and fund high-potential clinical trials, replacing slow, centralized grant committees with a high-integrity, liquid decentralized economy.

---

## 🛑 The Problem: Allocation Inefficiency

Medical research funding faces a critical mismatch between available capital and promising science. The issue isn't a lack of money; it's a **failure of discovery.**

### The Numbers
* **The Valley of Death:** Global health research requires **£180 million annually** to bridge the gap between discovery and commercialization.
* **The UK Gap:** The UK faces a **£1 billion cancer research funding gap** over the next decade.
* **Capital Flight:** VC funding for medical research is down **65%** (Q2 2025 vs 2021), and biotech IPOs have plummeted from 100+ to fewer than 10 annually.

### Why the Gap?
1. **Sequential vs. Parallel:** Traditional grant review relies on 5-15 person committees sequentially evaluating thousands of proposals. No small committee possesses the breadth AND depth across oncology, neurology, and cardiology to price risk accurately.
2. **The 12-Month Lag:** Review cycles take an average of 12 months. Committees make binary (fund/reject) decisions based on data that is often months out of date by the time funds are awarded.
3. **Information Asymmetry:** VCs wait for Phase 2 data (50% success rate) to de-risk, but researchers need funding to *generate* that data. The loop is broken.

---

## 💡 The Solution: Prediction Markets for Research Quality

Helix aggregates distributed expertise, enabling hundreds of specialists to evaluate hundreds of proposals simultaneously within a 30-day window.

### The Helix Mechanism
* **Expert-Only Markets:** Credentialed domain specialists trade YES/NO tokens based on their conviction in a proposal's scientific merit and likelihood of success.
* **Reputation Weighting:** Expertise matters more than wealth. Trades are weighted by a dynamic **Reputation Score** (PhD, h-index, prediction track record). A specialist’s $1k trade can count **20-50x more** than a generalist’s $10k, preventing wealth from overriding insight.
* **Algorithmic Capital Allocation:** When a proposal reaches an **~80% confidence threshold** (tracked via TWAP), smart contracts automatically trigger funding. No bureaucracy, just mathematics.
* **The Safety Net:** If research remains unfunded (doesn't hit the trust threshold), experts receive **full refunds.** This removes downside risk, encouraging honest participation without the fear of capital loss on low-quality projects.

### Why Helix Wins
| Feature | Helix (Prediction Market) | Grant Committees | DAOs / Kickstarter |
| :--- | :--- | :--- | :--- |
| **Speed** | 30-day parallel evaluation | 12-month sequential review | Popularity based |
| **Logic** | Quantitative Signal (e.g. 78%) | Binary (Yes/No) vote | Wealth/Hype weighted |
| **Stakes** | Conviction-based (Capital at risk) | No personal skin-in-game | "Cheap talk" voting |
| **Resolution** | Verifiable data (Flare FDC) | Static snapshot | Subjective |

---

## 🛠 Technical Features & Flare Integration

Helix is built as an **Enshrined Data Protocol**, leveraging Flare’s L1 data capabilities to ensure scientific and financial integrity.

### 1. Verification & Resolution (Flare Data Connector)
* **Pre-Market:** Validates institutional affiliation and clinical trial registrations via attestation requests to catch fraud early.
* **Post-Market:** Fetches and verifies trial results (ClinicalTrials.gov, PubMed) via Merkle Proofs to trustlessly resolve markets and payout winners.

### 2. The XRP Liquidity Layer (FAssets & FXRP)
We unlock the **$128B XRP market cap**. Through Flare’s **FAssets**, XRP holders bridge to **FXRP** to act as Liquidity Providers (LPs) for the grant pool. 
* **Signal vs. Capital:** Experts provide the **SIGNAL** (Prediction), while the XRP community provides the **CAPITAL** (Funding). 

### 3. Stability & Fair Pricing (FTSO & TWAP)
* **Flare Time Series Oracle (FTSO):** Tracks real-time XRP/USD prices, ensuring funding targets hit their precise USD value regardless of crypto volatility.
* **Time-Weighted Average Price (TWAP):** Determines resolution thresholds to prevent price manipulation and premature market closure due to short-term spikes.

### 4. IP-NFTs & Data Anchoring
Every proposal is minted as an **IP-NFT**, associating the project with the researcher's on-chain identity and protecting their intellectual property. Research data is anchored to ensure a permanent, immutable record of the discovery process.

Integrating the Flare stack was a highlight of our development process, particularly due to how it abstracts the complexities of cross-chain data. The FAsset system made XRP integration almost "plug-and-play"; by treating FXRP as a standard ERC-20, we could unlock billions in dormant liquidity without writing a single line of custom bridging code. This allowed our smart contracts to focus entirely on the DeSci bonding curves and grant logic rather than infrastructure.

Our experience with the Flare Data Connector (FDC) was equally streamlined. The protocol’s ability to handle attestation requests and merkle proofs meant we didn't have to build expensive, centralized off-chain listeners to verify clinical trials. Instead, we could trust Flare’s enshrined consensus to deliver verified Web2 data directly into our EVM environment.

---

## 📈 Commercial Viability & Impact

* **Market Size:** The Phase 2 "Valley of Death" represents a **$10-20B global annual need.** Even 5% market capture facilitates **$500M-$1B** in research annually.
* **Revenue Model:**
    * **2% fee** on successful prediction payouts.
    * **3% exit tax** on position changes to disincentivize HFT manipulators.
    * **Pool management fees** (1% of deployed capital).

---

## ⚖️ Trust & Ethics: Our Design Principles

Helix is built on a **Trust-Based Design** that assumes researchers are good actors while programmatically preventing exploitation:
* **Anti-Insider Trading:** Researcher accounts and their known collaborators are banned from trading in their own markets.
* **1x Return Cap:** We focus on **recognition, not speculation.** Returns are capped to prevent hyper-speculative "pump and dump" cycles in sensitive medical markets.
* **Identity Verification:** Wallet-to-identity mapping ensures that reputation is a finite, valuable resource that incentivizes integrity.

---

## 🚀 Tech Stack
* **Frontend:** JS, React, TypeScript, Node.js
* **Smart Contracts:** Solidity (Hardhat, viaIR optimization)
* **Flare Integration:** FDC (Verification/Resolution), FTSO (Oracle Pricing), FAssets (XRP Liquidity)
* **Mechanisms:** AMM (Linear Bonding Curve), TWAP, IP-NFTs

---
# 📦 Helix Protocol Documentation

---

## 🚀 Technical Setup & Smart Contracts

Helix is designed for high-integrity execution on the Flare Network, utilizing the **viaIR** compiler pipeline to manage complex memory operations required by the Flare Data Connector (FDC).

### Installation & Environment

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/helix-desci.git
   cd helix-desci/packages/hardhat
````

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root of the Hardhat directory based on the following template:

   ```env
   PRIVATE_KEY=your_private_key_here
   COSTON2_RPC=https://coston2-api.flare.network/ext/C/rpc
   MAINNET_FORKING_ENABLED=false
   ```

### Deployment & Explorer Links (Coston2 Testnet)

| Contract    | Address | 
| ----------- | ------- |
| HelixMarket | 0x1Cf3B6067FdC3CcF821FdcB95a189dA9dd07d163   | 
| MockFXRP    | 0x015852502f55534400000000000000000000000000   |

> **Note:** For the hackathon demo, if not deployed to a live network, run the simulation:
>
> ```bash
> npx hardhat test test/helix-economy-test.js
> ```

---

## 📜 License

MIT License

Copyright (c) 2026 Helix Protocol

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


