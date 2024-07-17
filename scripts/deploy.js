// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.


// This code is a Hardhat script for deploying smart contracts.


const hre = require("hardhat"); //  Imports the Hardhat Runtime Environment

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}


// Setting up initial states for a blockchain application.
async function main() {

  // Gets a list of signers (accounts)
  [buyer, seller, inspector, lender] = await ethers.getSigners();

   // Deploy the RealEstate
   const RealEstate = await ethers.getContractFactory('RealEstate');
   const realEstate = await RealEstate.deploy();
   await realEstate.waitForDeployment();

   console.log(`Deployed Real Estate Contract at: ${await realEstate.getAddress()}`);
   console.log(`Minting 3 properties...\n`);

    // Minting
   for (let i = 0; i < 3; i++) {

    // connects to the seller account and calls the mint function
    const transaction = await realEstate.connect(seller).mintFunc(`https://ipfs.io/ipfs/QmYVmPA1Dzh27jgPjcGEj2rPEKwzPSuErWVDa8F2QP6L1Z/${i + 1}.json`);
    await transaction.wait();
  }

  // Deploy Escrow
  const Escrow = await ethers.getContractFactory('Escrow');
  const escrow = await Escrow.deploy(
       await realEstate.getAddress(),
       seller.address,
       inspector.address,
       lender.address
  )
  await escrow.waitForDeployment();

  console.log(`Deployed Escrow Contract at: ${await escrow.getAddress()}`);
  console.log(`Listing 3 properties...\n`);

  for (let i = 0; i < 3; i++) {
    // Approve properties...
    let transaction = await realEstate.connect(seller).approve(await escrow.getAddress(), i + 1)
    await transaction.wait()
  }


   // Listing properties...
   transaction = await escrow.connect(seller).propertyList(1, tokens(20), tokens(10), buyer.address);
   await transaction.wait();
 
   transaction = await escrow.connect(seller).propertyList(2, tokens(15), tokens(5), buyer.address);
   await transaction.wait();
 
   transaction = await escrow.connect(seller).propertyList(3, tokens(10), tokens(5), buyer.address);
   await transaction.wait();
 
   console.log("Finished Listing.")
 

} 

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
