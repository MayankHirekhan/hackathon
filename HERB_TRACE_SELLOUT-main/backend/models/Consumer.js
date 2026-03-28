const mongoose = require("mongoose")

const ConsumerSchema = new mongoose.Schema({

 name:String,

 email:{
  type:String,
  unique:true
 },

 password:String,

 phone:String,

 location:String,

 createdAt:{
  type:Date,
  default:Date.now
 }

})

module.exports = mongoose.model("Consumer",ConsumerSchema)