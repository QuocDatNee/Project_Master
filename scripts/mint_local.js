// scripts/mint_local.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log("Usage: node scripts/mint_local.js <contractAddress> <toAddress> <tokenURI>");
    process.exit(1);
  }
  const [contractAddress, toAddress, tokenURI] = args;

  const RPC = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(RPC);
  const pkAccount0 = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const signer = new ethers.Wallet(pkAccount0, provider);

  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "CertNFT.sol", "CertNFT.json");
  if (!fs.existsSync(artifactPath)) throw new Error("Artifact missing, run compile first.");
  const raw = fs.readFileSync(artifactPath, "utf8");
  const json = JSON.parse(raw);
  const abi = json.abi;

  const contract = new ethers.Contract(contractAddress, abi, signer);

  console.log("Minting to:", toAddress, "tokenURI:", tokenURI);
  const tx = await contract.mintTo(toAddress, tokenURI);
  console.log("Mint tx hash:", tx.hash);
  await provider.waitForTransaction(tx.hash);

  // try to read minted tokenId via nextTokenId()-1
  try {
    const next = await contract.nextTokenId();
    const tokenId = (typeof next === "bigint") ? (next - 1n).toString() : (BigInt(next.toString()) - 1n).toString();
    console.log("Minted tokenId:", tokenId);
  } catch (e) {
    console.log("Cannot read nextTokenId():", e.message || e);
  }

  const now = new Date().toISOString().replace(/[:.]/g, "-");
  const log = { timestamp: now, contractAddress, toAddress, tokenURI, txHash: tx.hash };
  const logsDir = path.join(__dirname, "..", "logs");
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  const logPath = path.join(logsDir, `mint-local-${now}.json`);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2), "utf8");
  console.log("Saved log:", logPath);
}

main().catch((err) => {
  console.error("ERROR:", err);
  process.exitCode = 1;
});
