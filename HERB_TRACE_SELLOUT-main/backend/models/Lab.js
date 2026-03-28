const mongoose = require("mongoose")

const LabSchema = new mongoose.Schema({

 name:{
  type:String,
  required:true
 },

 email:{
  type:String,
  required:true,
  unique:true
 },

 password:{
  type:String,
  required:true
 },

 labName:{
  type:String,
  required:true
 },

 certifications:{
  type:String,
  default:""
 },

 location:{
  type:String,
  default:""
 },

 experience:{
  type:Number,
  default:0
 },

 totalBatchesTested:{
  type:Number,
  default:0
 },

 rating:{
  type:Number,
  default:4.5
 },

 profilePhoto:{
  type:String,
  default:"/default-lab.jpg"
 },

 createdAt:{
  type:Date,
  default:Date.now
 }

})

module.exports = mongoose.model("Lab", LabSchema)
