// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * CertNFT: ERC-721 cho chứng chỉ học thuật
 * - onlyOwner mới được mint (để nhà trường/giáo vụ kiểm soát phát hành)
 * - _nextTokenId tự tăng từ 1 (dễ đọc số hiệu chứng chỉ)
 * - Lưu tokenURI per token (trỏ metadata/IPFS của chứng chỉ)
 */
contract CertNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
	Ownable(msg.sender) // truyền owner mặc định là người deploy
    {}

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function mintTo(address to, string memory tokenURI_) external onlyOwner {
        uint256 tokenId = _nextTokenId;
        _nextTokenId += 1;



        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit Minted(to, tokenId, tokenURI_);
    }
}
