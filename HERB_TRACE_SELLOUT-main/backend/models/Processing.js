const mongoose = require("mongoose")

const ProcessingSchema = new mongoose.Schema({

 batchId:String,
 herbName:String,

 processType:String,

 inputQuantity:Number,
 outputQuantity:Number,

 lossPercentage:Number,

 processedBy:String,

 date:{
  type:Date,
  default:Date.now
 }

})

module.exports = mongoose.model("Processing",ProcessingSchema)