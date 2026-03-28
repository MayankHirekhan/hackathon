const mongoose = require("mongoose")

const InventorySchema = new mongoose.Schema({

 herbName:String,

 stock:Number,

 unit:String,

 supplierId:String,

 updatedAt:{
  type:Date,
  default:Date.now
 }

})

module.exports = mongoose.model("Inventory",InventorySchema)