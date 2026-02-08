import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the HelixMarket contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployHelixMarket: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.
    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("HelixMarket", {
    from: deployer,
    // Contract constructor arguments
    // Your HelixMarket constructor takes NO arguments, so we leave this empty
    args: [], 
    log: true,
    // autoMine: faster deployment on local networks
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const helixMarket = await hre.ethers.getContract<Contract>("HelixMarket", deployer);
  
  // Verify it worked by printing the admin address
  console.log("👋 HelixMarket deployed by Admin:", await helixMarket.admin());
};

export default deployHelixMarket;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags HelixMarket
deployHelixMarket.tags = ["HelixMarket"];