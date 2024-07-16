const { expect } = require('chai');
//const { values } = require('fp-ts/lib/Map');
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

        // console.log(buyer.address)
        // console.log(seller.address)
        // console.log(inspector.address)
        // console.log(lender.address)

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

    describe("Lender Approval", async () => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).lenderApproval(1);
            await transaction.wait();

            transaction = await escrow.connect(lender).lenderApproval(1);
            await transaction.wait();

            transaction = await escrow.connect(inspector).lenderApproval(1);
            await transaction.wait();
        })

        it("Update the Lender Status", async () => {
            expect(await escrow.isApproved(1, buyer.address)).to.be.equal(true);
            expect(await escrow.isApproved(1, lender.address)).to.be.equal(true);
            expect(await escrow.isApproved(1, inspector.address)).to.be.equal(true);
        })
    })


    describe('finalizedSale', () => {
        beforeEach(async () => {
            let transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) })
            await transaction.wait()

            transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
            await transaction.wait()

            transaction = await escrow.connect(buyer).lenderApproval(1)
            await transaction.wait()

            transaction = await escrow.connect(seller).lenderApproval(1)
            await transaction.wait()

            transaction = await escrow.connect(lender).lenderApproval(1)
            await transaction.wait()
            
            // send Ether from the lender to the escrow 
            await lender.sendTransaction({ to: await escrow.getAddress(), value: tokens(5) })

            transaction = await escrow.connect(seller).finalizedSale(1)
            await transaction.wait()
        })

        it('Updates ownership of NFT', async () => {
            expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address)
        })

        it('Updates balance of Escrow', async () => {
            expect(await escrow.getBalance()).to.be.equal(0)
        })
    })


    describe('Cancel Sale', async () => {
        it('Refunds buyer if inspection not passed', async () => {
            // Buyer deposits earnest money
            let transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) });
            await transaction.wait();

            // Set inspection status to not passed
            transaction = await escrow.connect(inspector).updateInspectionStatus(1, false);
            await transaction.wait();

            // Buyer's balance before cancellation
            const buyerBalanceBefore = await ethers.provider.getBalance(buyer.address);

            // Cancel the sale
            transaction = await escrow.connect(buyer).cancelSale(1);
            await transaction.wait();

            // Buyer's balance after cancellation
            const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);

            const balanceDifference = buyerBalanceAfter-buyerBalanceBefore;

            // Check if the buyer's balance has increased by the escrow amount
            expect(balanceDifference).to.be.closeTo(tokens(5), ethers.parseUnits("0.01", "ether"));
        });

        it('Transfers balance to seller if inspection passed', async () => {
            // Buyer deposits earnest money
            let transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) });
            await transaction.wait();

            // Set inspection status to passed
            transaction = await escrow.connect(inspector).updateInspectionStatus(1, true);
            await transaction.wait();

            // seller's balance before cancellation
            const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);

            // Cancel the sale
            transaction = await escrow.connect(seller).cancelSale(1);
            await transaction.wait();

            // seller's balance after cancellation
            const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);

            const balanceDifference = sellerBalanceAfter - sellerBalanceBefore;

            // Check if the seller's balance has increased by the escrow amount
            expect(balanceDifference).to.be.closeTo(tokens(5), ethers.parseUnits("0.01", "ether"));
        });
    })

})




