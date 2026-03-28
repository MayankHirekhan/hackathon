const {ethers} = require("ethers")

const contractAddress = "PASTE_CONTRACT_ADDRESS"

const abi = [
 "function storePacket(string packetId,string herbName,string hash)"
]

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")

const wallet = new ethers.Wallet(
 "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
 provider
)

const contract = new ethers.Contract(contractAddress,abi,wallet)

async function storeOnBlockchain(packetId,herbName,hash){

 const tx = await contract.storePacket(packetId,herbName,hash)

 await tx.wait()

 console.log("Stored on blockchain:",packetId)

}

module.exports = storeOnBlockchain