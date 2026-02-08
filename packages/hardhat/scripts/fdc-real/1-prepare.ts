import { ethers } from "hardhat";
import axios from "axios";
import https from "https"; // <--- 1. Import HTTPS

// CONFIGURATION
const VERIFIER_URL = "https://jq-verifier-test.flare.rocks/verifier/IJsonApi/prepareRequest";
const API_KEY = "00000000-0000-0000-0000-000000000000"; 

const ATTESTATION_TYPE = "0x" + Buffer.from("IJsonApi", "utf8").toString("hex").padEnd(64, "0");
const SOURCE_ID = "0x" + Buffer.from("WEB2", "utf8").toString("hex").padEnd(64, "0");

async function main() {
  const requestBody = {
    url: "https://jsonplaceholder.typicode.com/todos/1",
    postprocessJq: ".completed", 
    abi_signature: "{\"components\":[],\"name\":\"result\",\"type\":\"bool\"}" 
  };

  console.log("📡 contacting Flare Verifier Node...");

  try {
    // 2. Create an Agent that ignores SSL errors (The Fix for Error 526)
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });

    // 3. Send the request with the agent attached
    const response = await axios.post(VERIFIER_URL, {
        attestationType: ATTESTATION_TYPE,
        sourceId: SOURCE_ID,
        requestBody: requestBody
    }, {
        headers: {
            "x-apikey": API_KEY 
        },
        httpsAgent: agent // <--- Attaching the agent here
    });

    if (response.data.status === "VALID") {
      console.log("\n✅ Request Prepared Successfully!");
      console.log("-----------------------------------");
      console.log("ABI Encoded Request:", response.data.abiEncodedRequest);
      console.log("-----------------------------------");
      console.log("\nSAVE THIS STRING! You need it for Step 2.");
    } else {
      console.error("❌ Verifier rejected request:", response.data);
    }
  } catch (error) {
    // Better error logging to see what's wrong
    if (axios.isAxiosError(error)) {
        console.error("❌ Axios Error:", error.message);
        if (error.response) {
            console.error("   Status:", error.response.status);
            console.error("   Data:", error.response.data);
        }
    } else {
        console.error("❌ Unknown Error:", error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});