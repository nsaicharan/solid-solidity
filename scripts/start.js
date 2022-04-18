const hre = require('hardhat');
const { resolveHref } = require('next/dist/shared/lib/router/router');

async function main() {
  // We get the contract to deploy
  const KeyboardsContract = await hre.ethers.getContractFactory('Keyboards');
  const keyboardsContract = await KeyboardsContract.deploy();
  const [owner, somebodyElse] = await hre.ethers.getSigners();

  await keyboardsContract.deployed();
  console.log('Keyboards deployed to:', keyboardsContract.address);

  const keyboardTxn1 = await keyboardsContract.create(0, true, 'sepia');
  await keyboardTxn1.wait();

  const keyboardTxn2 = await keyboardsContract
    .connect(somebodyElse)
    .create(1, false, 'grayscale');
  await keyboardTxn2.wait();

  const keyboards2 = await keyboardsContract.getKeyboards();
  console.log('New keyboards:', keyboards2);

  const balanceBefore = await hre.ethers.provider.getBalance(somebodyElse.address);
  console.log("Balance before: ", hre.ethers.utils.formatEther(balanceBefore));

  const tipTxn = await keyboardsContract.tip(1, { value: hre.ethers.utils.parseEther('1000') });
  await tipTxn.wait();

  const balanceAfter = await hre.ethers.provider.getBalance(somebodyElse.address);
  console.log("Balance after: ", hre.ethers.utils.formatEther(balanceAfter));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
