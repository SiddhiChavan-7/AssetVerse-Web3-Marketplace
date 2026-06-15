// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetVerseNFT is ERC721, Ownable {
    uint256 public nextTokenId;

    mapping(uint256 => string) private tokenURIs;

    constructor() ERC721("AssetVerse NFT", "AVNFT") Ownable(msg.sender) {}

    function mintNFT(
        address recipient,
        string memory metadataURI
    ) public returns (uint256) {
        uint256 tokenId = nextTokenId;

        _safeMint(recipient, tokenId);

        tokenURIs[tokenId] = metadataURI;

        nextTokenId++;

        return tokenId;
    }

    function getTokenURI(
        uint256 tokenId
    ) public view returns (string memory) {
        return tokenURIs[tokenId];
    }
}