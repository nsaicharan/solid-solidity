const hre = require('hardhat');

async function main() {
  // We get the contract to deploy
  const KeyboardsContract = await hre.ethers.getContractFactory('Keyboards');
  const keyboardsContract = await KeyboardsContract.deploy();

  await keyboardsContract.deployed();
  console.log('Keyboards deployed to:', keyboardsContract.address);

  const keyboardTxn1 = await keyboardsContract.create(0, true, 'sepia');
  await keyboardTxn1.wait();

  const keyboardTxn2 = await keyboardsContract.create(1, false, 'grayscale');
  await keyboardTxn2.wait();

  const keyboards2 = await keyboardsContract.getKeyboards();

  console.log('New keyboards:', keyboards2);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
