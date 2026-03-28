const mongoose = require("mongoose")

const PacketSchema = new mongoose.Schema({

 packetId:String,
 batchId:String,
 herbName:String,
 weight:Number,

 qrCode:String,

 hash:String,
 previousHash:String,

 status:{
  type:String,
  default:"available"
 },

 createdAt:{
  type:Date,
  default:Date.now
 }

})

module.exports = mongoose.model("Packet",PacketSchema)  