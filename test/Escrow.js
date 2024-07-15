const { expect } = require('chai');
const { values } = require('fp-ts/lib/Map');
const { ethers } = require('hardhat');

// Convert to Ether
const tokens = (n) => {
    return ethers.parseUnits( n.toString(),"ether")
}

describe('Escrow', () => {

    let buyer, seller, inspector, lender;
    let realEstate, escrow;

    beforeEach(async () =>{
        [buyer, seller, inspector, lender] = await ethers.getSigners();

        console.log(buyer.address)
        console.log(seller.address)
        console.log(inspector.address)
        console.log(lender.address)

        // Deploy the RealEstate
        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();
        // Mint
       let transaction = await realEstate.connect(seller).mintFunc("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
       await transaction.wait();

       

       // Deploy Escrow
       const Escrow = await ethers.getContractFactory('Escrow');
       escrow = await Escrow.deploy(
            await realEstate.getAddress(), // RealEstate is a contract, so get its address using await realEstate.getAddress()
            seller.address,
            inspector.address,
            lender.address
       )

       // Approve Property
       transaction = await realEstate.connect(seller).approve(await escrow.getAddress(),1);
       await transaction.wait();

       // List the Property
       transaction = await escrow.connect(seller).propertyList(1,tokens(10),tokens(5),buyer.address);
       await transaction.wait();
      
    })


    describe('Deployments', () => {

        it('Returns NFT address', async () => {
            const result = await escrow.nftAddress()
            expect(result).to.be.equal(await realEstate.getAddress())
        })
    
        it('Returns the seller', async () => {
            const result = await escrow.seller();
            expect(result).to.be.equal(seller.address);
        })
    
        it('Returns the inspector', async () => {
            const result = await escrow.inspector();
            expect(result).to.be.equal(inspector.address);
        })
    
        it('Returns the lender', async () => {
            const result = await escrow.lender();
            expect(result).to.be.equal(lender.address);
        })
    })

    describe("Listing a New Property", async () => {

        it("Update the List", async () => {
            const result = await escrow.isListed(1);
            expect(result).to.be.equal(true);
        })

        it("Update the OwnerShip of the NFT", async () =>{
            const result = await realEstate.ownerOf(1);
            expect(result).to.be.equal(await escrow.getAddress());
        })

        it("Returns the Buyer", async () => {
            const result = await escrow.buyer(1);
            expect(result).to.be.equal(buyer.address);
        })
        
        it("Returns the Purchase Price", async () => {
            const result = await escrow.purchasePrice(1);
            expect(result).to.be.equal(tokens(10));
        })

        it("Returns the Escrow amount", async () => {
            const result = await escrow.escrowAmount(1);
            expect(result).to.be.equal(tokens(5));
        })

    })


    describe("Buyer Deposit Earnest", async () => {

        beforeEach(async () => {
            const transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) });
            await transaction.wait();
        })

        it("Update contract value", async () => {
            const result = await escrow.getBalance();
            expect(result).to.be.equal(tokens(5));
        })
    })


    describe("Inspection of the property", async () => {

        beforeEach(async () => {
            const transaction = await escrow.connect(inspector).updateInspectionStatus(1,true)
            await transaction.wait();
        })

        it("Update the Inspection", async () =>{
            const result = await escrow.isInspectionPassed(1);
            expect(result).to.be.equal(true);
        })
        
    })

})




