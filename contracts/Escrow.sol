// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public lender;
    address public inspector;
    address payable public sellor;  // Sellor recievs crypto currency
    address public nftAddress;

    constructor (
        address _lender, 
        address _inspector, 
        address payable _sellor,
        address _nftAddress
    ){
        lender=_lender;
        inspector=_inspector;
        sellor=_sellor;
        nftAddress=_nftAddress;
    }
}
