const hre = require("hardhat");

async function main() {
  const Create = await hre.ethers.getContractFactory("Create");
  const create = await Create.deploy();

  await create.deployed();

  console.log("CONTRACT_ADDRESS:", create.address);
}

//npx hardhat run scripts/deploy.js --network polygon_amoy
//npx hardhat run scripts/deploy.js --network localhost

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
