// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// The core and metadata extensions, with a base URI mechanism.
// Thi is a standard for non-fungible tokens (NFTs) on the Ethereum blockchain.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Useful for ID generation, counting contract activity.
import "@openzeppelin/contracts/utils/Counters.sol";

// This extension allows you to associate a URI with each token ID 
// Storing metadata like images, descriptions, etc.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; 


// Constructing an ERC721 Token Contract
contract RealEstate is ERC721URIStorage{
        using Counters for Counters.Counter;
        Counters.Counter private _tokenIds; // Starting from 0

        // The constructor initializes the ERC721 contract 
        // with a name ("Real Estate") and a symbol ("REAL").
        constructor() public ERC721("Real Estate", "REAL") {}

        // This function mints a new token.
        function mintFunc(string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment(); // Increments the token ID

        uint256 newItemId = _tokenIds.current();  // Gets the current token ID.

        _mint(msg.sender, newItemId); // Mints a new token with the incremented token ID and assigns it to the sender (msg.sender).

        _setTokenURI(newItemId, tokenURI); // Sets the URI for the token, associating it with its metadata.

        return newItemId;
    
    }

    function totalSupply() public view returns(uint256){
        return _tokenIds.current();
    }

}