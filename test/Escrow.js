const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    it("Display the Address", async () => {
        const RealState = await ethers.getContractFactory("RealEstate");
        const realState = await RealState.deploy();
        console.log(realState.address)
    })
})
