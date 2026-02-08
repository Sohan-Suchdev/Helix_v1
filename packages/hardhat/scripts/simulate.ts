import { ethers } from "hardhat";

async function main() {
  const [deployer, researcher, traderA, traderB] = await ethers.getSigners();

  console.log("\n🧪 STARTING HELIX DESCI SIMULATION...");
  console.log("======================================");

  // 1. DEPLOY
  const HelixMarket = await ethers.getContractFactory("HelixMarket");
  const market = await HelixMarket.deploy({ gasLimit: 6000000 }); 
  await market.waitForDeployment();
  console.log("✅ Market Deployed to:", await market.getAddress());

  // 2. CREATE PROPOSAL
  await market.connect(researcher).createProposal("Lupus Cure Phase 1", researcher.address, { gasLimit: 6000000 });
  console.log("✅ Proposal #0 Created by Researcher");

  // =========================================================
  // PHASE 1: DESC - IP & DATA ANCHORING (NEW!)
  // =========================================================
  console.log("\n🔬 PHASE 1: DESCI OPERATIONS (IP & DATA)");

  // 1. Upload Data
  const fakeIpfsHash = "QmXyZ123...DataHash...ABC";
  console.log("   💾 Researcher uploads raw trial data to IPFS:", fakeIpfsHash);
  await market.connect(researcher).uploadResearchData(0, fakeIpfsHash, { gasLimit: 6000000 });
  console.log("      ✅ Data Anchored on-chain!");

  // 2. Mint IP-NFT
  console.log("   💎 Researcher mints IP-NFT (The Patent)...");
  await market.connect(researcher).mintIPNFT(0, { gasLimit: 6000000 });
  console.log("      ✅ IP-NFT Minted to Researcher wallet!");

  // =========================================================
  // PHASE 2: TRADING WAR
  // =========================================================
  console.log("\n⚔️ PHASE 2: THE TRADING WAR");

  console.log("   🟢 Trader A buys 5 ETH of YES...");
  await market.connect(traderA).buy(0, true, { value: ethers.parseEther("5.0"), gasLimit: 6000000 });

  console.log("   🔴 Trader B buys 2 ETH of NO...");
  await market.connect(traderB).buy(0, false, { value: ethers.parseEther("2.0"), gasLimit: 6000000 });

  // =========================================================
  // PHASE 3: FUNDING TRIGGER
  // =========================================================
  console.log("\n⏳ PHASE 3: FUNDING UNLOCK (TWAP)");
  
  await ethers.provider.send("evm_increaseTime", [65]);
  await ethers.provider.send("evm_mine", []);

  const balBefore = await ethers.provider.getBalance(researcher.address);
  await market.checkFundingTrigger(0, { gasLimit: 6000000 });
  const balAfter = await ethers.provider.getBalance(researcher.address);
  
  console.log("   🎉 GRANT PAID TO RESEARCHER:", ethers.formatEther(balAfter - balBefore), "ETH");

  // =========================================================
  // PHASE 4: FLARE RESOLUTION
  // =========================================================
  console.log("\n🏁 PHASE 4: FLARE RESOLUTION");

  console.log("   🔮 Flare FDC verifies: 'TRIAL SUCCESS'");
  await market.simulateOracleDecision(0, true, { gasLimit: 6000000 }); 

  console.log("   🏆 Trader A Claims Winnings...");
  const balABefore = await ethers.provider.getBalance(traderA.address);
  await market.connect(traderA).claimWinnings(0, { gasLimit: 6000000 });
  const balAAfter = await ethers.provider.getBalance(traderA.address);
  
  console.log("      Trader A Profit:", ethers.formatEther(balAAfter - balABefore), "ETH");
  console.log("\n✅ FULL DESCI SIMULATION COMPLETE.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});