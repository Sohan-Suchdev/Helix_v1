// scripts/mini-economy-sim.js
const { ethers } = require("hardhat");

async function main() {
  const [admin, researcher, whale, retail] = await ethers.getSigners();

  // Deploy FXRP mock
  const Token = await ethers.getContractFactory("MockToken");
  const fxrp = await Token.connect(admin).deploy("Wrapped XRP", "FXRP");
  await fxrp.waitForDeployment();
  const fxrpAddr = await fxrp.getAddress();

  // Deploy HelixMarket with FXRP address
  const Helix = await ethers.getContractFactory("HelixMarket");
  const helix = await Helix.connect(admin).deploy(fxrpAddr);
  await helix.waitForDeployment();

  // Fund whale with FXRP
  await fxrp.mint(whale.address, ethers.parseUnits("100000", 18));

  // Step 1: Researcher creates proposal
  const auditUrl = "https://clinicaltrials.gov/api/v2/studies/NCT012345";
  await helix.connect(researcher).createProposal("mRNA Lung Cancer Vaccine", researcher.address, auditUrl);
  console.log("✅ Proposal Created");

  // Step 2: Whale FXRP buy, Retail ETH buy
  await fxrp.connect(whale).approve(await helix.getAddress(), ethers.parseUnits("10000", 18));
  await helix.connect(whale).buyWithFXRP(0, true, ethers.parseUnits("10000", 18));
  await helix.connect(retail).buy(0, true, { value: ethers.parseUnits("1", 18) });
  let p = await helix.proposals(0);
  console.log("💰 FXRP In Market:", ethers.formatUnits(p.fxrpInMarket, 18));
  console.log("💰 ETH In Market:", ethers.formatUnits(p.ethInMarket, 18));

  // Step 3: Mint IP-NFT + upload data
  await helix.connect(researcher).mintIPNFT(0);
  await helix.connect(researcher).uploadResearchData(0, "QmXoyp...ipfs_hash");
  p = await helix.proposals(0);
  console.log("🧬 IP-NFT Minted:", p.ipNftMinted);

  // Step 4: Simulate outcome
  await helix.simulateOracleDecision(0, true);
  p = await helix.proposals(0);
  console.log("📡 Resolved:", p.isResolved, "Outcome:", p.outcome);

  // Step 5: Claim winnings
  const whalePreFXRP = await fxrp.balanceOf(whale.address);
  await helix.connect(whale).claimWinnings(0);
  await helix.connect(retail).claimWinnings(0);
  const whalePostFXRP = await fxrp.balanceOf(whale.address);

  console.log("🏆 Whale FXRP:", ethers.formatUnits(whalePostFXRP, 18), "(delta:", ethers.formatUnits(whalePostFXRP - whalePreFXRP, 18), ")");
  console.log("✅ Mini-Economy Simulation Complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});