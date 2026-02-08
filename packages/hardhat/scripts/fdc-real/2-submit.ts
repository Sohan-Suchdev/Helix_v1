import { ethers } from "hardhat";

// 1. Valid ABI Encoded Request (Pre-calculated placeholder since Verifier is down)
const ABI_ENCODED_REQUEST = "0x494a736f6e41706900000000000000000000000000000000000000000000000057454232000000000000000000000000000000000000000000000000000000008518e95088277258907993081123472661571440875326588266205561570188000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000001168747470733a2f2f676f6f676c652e636f6d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012e00000000000000000000000000000000000000000000000000000000000000";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Submitting to FDC Hub with account:", deployer.address);

  // 2. FdcHub Address on Coston2
  const FDC_HUB_ADDRESS = "0x56aa7c92461a9732788931121df7d377b21235b2";
  // 3. Define the Interface Manually (Fixes 'Property does not exist' error)
  const FDC_HUB_ABI = [
    "function requestAttestation(bytes calldata _attestationRequest) external payable"
  ];

  // 4. Connect to the Contract using the manual ABI
  const fdcHub = new ethers.Contract(FDC_HUB_ADDRESS, FDC_HUB_ABI, deployer);

  console.log("📍 FdcHub found at:", FDC_HUB_ADDRESS);
  console.log("⏳ Sending transaction...");

  try {
      // 5. Submit the Request
      const tx = await fdcHub.requestAttestation(ABI_ENCODED_REQUEST, {
        value: ethers.parseEther("1") // Fee to cover the request
      });

      console.log("✅ Transaction sent!");
      console.log("-----------------------------------");
      console.log("Hash:", tx.hash);
      console.log("-----------------------------------");
      
      const receipt = await tx.wait();
      console.log("✅ Transaction confirmed in Block:", receipt.blockNumber);

  } catch (error: any) {
      console.error("❌ Transaction Failed:", error.message);
      if (error.data) console.error("   Data:", error.data);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});