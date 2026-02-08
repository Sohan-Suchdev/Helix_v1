import { ethers } from "hardhat";
import axios from "axios";

// CONFIGURATION
const DA_LAYER_URL = "https://ctn2-data-availability.flare.network/api/proof/get-specific-proof";
const ROUND_ID = 12345; // REPLACE THIS with the Round ID from Step 2 (approx block number / 10 + offset)
const REQUEST_BYTES = "PASTE_YOUR_LONG_HEX_STRING_HERE"; // Same string from Step 1

async function main() {
  console.log(`🔎 Checking DA Layer for Round ${ROUND_ID}...`);

  try {
    const response = await axios.post(DA_LAYER_URL, {
      roundId: ROUND_ID,
      requestBytes: REQUEST_BYTES
    });

    if (response.data.proof) {
      console.log("\n🎉 PROOF FOUND!");
      console.log("-----------------------------------");
      
      // THIS is the struct your contract needs:
      const fdcProof = {
        merkleProof: response.data.proof, // The array of 32-byte hashes
        data: response.data.response      // The massive encoded data string
      };

      console.log("Merkle Proof:", fdcProof.merkleProof);
      console.log("Data:", fdcProof.data);
      console.log("-----------------------------------");
      console.log("\n👉 You can now call market.settleWithFlare(id, fdcProof) with this data!");
      
    } else {
      console.log("⏳ Proof not ready yet. Try again in 30 seconds.");
    }
  } catch (error) {
    console.error("❌ Error fetching proof (Round might be wrong or not finalized):", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});