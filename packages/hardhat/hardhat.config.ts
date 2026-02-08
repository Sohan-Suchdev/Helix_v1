import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { task } from "hardhat/config";
import generateTsAbis from "./scripts/generateTsAbis";

const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const etherscanApiKey = process.env.ETHERSCAN_V2_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";
const providerApiKey = process.env.ALCHEMY_API_KEY || "cR4WnXePioePZ5fFrnSiR";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.30",
        settings: {
          optimizer: { enabled: true, runs: 200 },
          viaIR: true, // Re-enable to fix "stack too deep"
        },
      },
    ],
  },
  // Use the in-memory network for tests
  defaultNetwork: "hardhat",
  namedAccounts: { deployer: { default: 0 } },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 30_000_000,
      gas: "auto", // avoid oversized per-tx gas limits
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    coston2: {
      url: "https://coston2-api.flare.network/ext/C/rpc",
      accounts: [deployerPrivateKey],
      chainId: 114,
    },
    //... keep the rest as-is...
  },
  etherscan: {
    apiKey: {
      coston2: "no-api-key-needed",
      mainnet: etherscanApiKey,
      sepolia: etherscanApiKey,
      arbitrumOne: etherscanApiKey,
      optimisticEthereum: etherscanApiKey,
      polygon: etherscanApiKey,
      base: etherscanApiKey,
      scroll: etherscanApiKey,
    },
    customChains: [
      {
        network: "coston2",
        chainId: 114,
        urls: {
          apiURL: "https://coston2-explorer.flare.network/api",
          browserURL: "https://coston2-explorer.flare.network",
        },
      },
    ],
  },
  verify: { etherscan: { apiKey: `${etherscanApiKey}` } },
  sourcify: { enabled: false },
};

task("deploy").setAction(async (args, hre, runSuper) => {
  await runSuper(args);
  await generateTsAbis(hre);
});

export default config;
