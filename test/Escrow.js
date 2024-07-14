const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    it("Save the Addresses", async () => {

        const signers  = await ethers.getSigners(); // Returns accounts available in the local Ethereum environment
        console.log(signers);

        const RealEstate = await ethers.getContractFactory("RealEstate");
        const realEstate = await RealEstate.deploy();
        console.log(realEstate.address);


    })
})
