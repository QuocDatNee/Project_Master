import { ethers } from "ethers";
import fs from "fs";

const contractABI = JSON.parse(
  fs.readFileSync("./artifacts/contracts/CertNFT.sol/CertNFT.json")
).abi;

async function main() {
  const contractAddress = process.argv[2];
  const tokenId = parseInt(process.argv[3]);  // 👈 lấy tokenId từ terminal

  // kết nối RPC localhost của hardhat
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const nft = new ethers.Contract(contractAddress, contractABI, provider);

  const owner = await nft.ownerOf(tokenId);
  const uri = await nft.tokenURI(tokenId);

  console.log(`✅ Token ${tokenId} owner: ${owner}`);
  console.log(`✅ Token ${tokenId} URI: ${uri}`);
}

main().catch(console.error);
