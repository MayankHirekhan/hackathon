import { ethers } from "ethers";
import fs from "fs";

async function main() {
  console.log("🚀 Deploying PacketTrace contract...");

  // Connect to local Hardhat blockchain
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // First Hardhat account private key (shown when you run `npx hardhat node`)
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const wallet = new ethers.Wallet(privateKey, provider);

  // Load compiled contract artifact
  const artifact = JSON.parse(
    fs.readFileSync(
      "./artifacts/contracts/PacketTrace.sol/PacketTrace.json",
      "utf8"
    )
  );

  // Create contract factory
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  // Deploy contract
  const contract = await factory.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("✅ PacketTrace deployed successfully!");
  console.log("📦 Contract Address:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});