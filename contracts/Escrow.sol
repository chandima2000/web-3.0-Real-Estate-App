// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


//  transferring NFTs between addresses
interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}


// Handles the escrow process for real estate transactions using NFTs
contract Escrow {
    address public lender;
    address public inspector;
    address payable public seller;  // Sellor recievs crypto currency
    address public nftAddress;

    modifier onlySeller() {
        require(msg.sender == seller,"Only seller can call this method.");
        _;
    }

    modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only Buyer can call this method.");
        _;
    }

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;

    constructor (
        address _nftAddress,
        address payable _seller,
        address _inspector,
        address _lender  
    ){
        lender =  _lender;
        inspector = _inspector;
        seller = _seller;
        nftAddress = _nftAddress;
    }

    
    //  listing of a property by transferring the NFT from the caller's address to the escrow contract.
    function propertyList (
            uint256 _nftID, // _nftID: The ID of the NFT representing the property.  
            uint256 _purchasePrice, 
            uint256 _escrowAmount, 
            address _buyer
        ) public payable onlySeller{
        // Transfers the specified NFT from the seller to the escrow contract.
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;

    }

    // Buyer Depositing Earnest
    function depositEarnest (uint256 _nftID) public payable onlyBuyer(_nftID) {
        require(msg.value >= escrowAmount[_nftID], "The amount is not Sufficient.");
    }

    // Handles the Ether, whic is recieved to this Contract
    receive() external payable {}

    // Returns the balance of Ether held by the escrow contract
    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }


}
