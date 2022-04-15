
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const KeyboardsContract = await hre.ethers.getContractFactory("Keyboards");
  const keyboardsContract = await KeyboardsContract.deploy();

  await keyboardsContract.deployed();
  console.log("Keyboards deployed to:", keyboardsContract.address);

  const keyboards = await keyboardsContract.getKeyboards();
  console.log("We got keyboards:", keyboards);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
