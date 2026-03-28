const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({

 user:String,
 comment:String,
 rating:Number

})

const FarmerSchema = new mongoose.Schema({

 name:String,
 email:String,
 password:String,

 farmName:String,
 location:String,
 experience:Number,

 rating:{
  type:Number,
  default:4.5
 },

 profilePhoto:{
  type:String,
  default:"https://i.pravatar.cc/150?img=12"
 },

 totalHarvests:Number,

 reviews:[ReviewSchema]

})

module.exports = mongoose.model("Farmer",FarmerSchema)