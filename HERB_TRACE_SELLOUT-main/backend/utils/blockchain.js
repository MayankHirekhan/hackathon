const crypto = require("crypto")

let previousHash="GENESIS"

function createBlock(data){

 const block={
  timestamp:Date.now(),
  data,
  previousHash
 }

 const hash=crypto
  .createHash("sha256")
  .update(JSON.stringify(block))
  .digest("hex")

 block.hash=hash

 console.log("----- BLOCKCHAIN BLOCK -----")
 console.log("DATA:",data)
 console.log("HASH:",hash)
 console.log("PREVIOUS:",previousHash)
 console.log("----------------------------")

 previousHash=hash

 return block
}

module.exports=createBlock