const mongoose = require("mongoose")

const SupplierSchema = new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 email:{
  type:String,
  required:true
 },

 password:{
  type:String,
  required:true
 },

 companyName:String,

 licenseNumber:String,

 location:String,

 experience:Number,

 phone:String,

 profilePhoto:{
  type:String,
  default:"/uploads/default-supplier.png"
 },

 rating:{
  type:Number,
  default:4.5
 },

 totalBatchesReceived:{
  type:Number,
  default:0
 },

 processedHerbs:{
  type:Number,
  default:0
 },

 inventoryStock:{
  type:Number,
  default:0
 },

 createdAt:{
  type:Date,
  default:Date.now
 }

})

module.exports = mongoose.model("Supplier", SupplierSchema)