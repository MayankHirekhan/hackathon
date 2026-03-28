const mongoose = require("mongoose")

const SupplierBatchSchema = new mongoose.Schema({

 batchId:String,

 herbName:String,

 farmer:String,

 quantity:Number,

 unit:String,

 harvestDate:String,

 location:String,

 supplierId:String,

 status:{
  type:String,
  default:"received"
 },

 receivedAt:{
  type:Date,
  default:Date.now
 }

})

module.exports = mongoose.model("SupplierBatch",SupplierBatchSchema)