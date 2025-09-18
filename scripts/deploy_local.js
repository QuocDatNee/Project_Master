// scripts/deploy_local.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const RPC = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(RPC);

  // private key account[0] của Hardhat node
  const pkAccount0 = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const signer = new ethers.Wallet(pkAccount0, provider);

  console.log("Using RPC:", RPC);
  console.log("Deployer:", signer.address);

  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "CertNFT.sol", "CertNFT.json");
  const raw = fs.readFileSync(artifactPath, "utf8");
  const json = JSON.parse(raw);
  const abi = json.abi;
  const bytecode = json.bytecode;

  const factory = new ethers.ContractFactory(abi, bytecode, signer);

  console.log("Deploying contract (constructor args: name, symbol)...");
  const contract = await factory.deploy("CertNFT", "CERT");

  const tx = contract.deploymentTransaction();
  await provider.waitForTransaction(tx.hash);

  const address = await contract.getAddress();
  console.log("✅ Contract deployed at:", address);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exitCode = 1;
});
