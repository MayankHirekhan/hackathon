const mongoose = require("mongoose")
const crypto = require("crypto")

const BatchSchema = new mongoose.Schema({

batchId:{
type:String,
required:true,
unique:true
},

herbName:{
type:String,
required:true
},

quantity:{
type:Number,
required:true
},

unit:{
type:String,
default:"kg"
},

harvestDate:String,
location:String,

latitude:Number,
longitude:Number,
geoImage:String,

/* FARMER */

farmer:{
type:String,
required:true
},

farmerId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Farmer"
},

profilePhoto:String,
rating:Number,

/* SUPPLIER */

supplierId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Supplier"
},

supplierName:String,
supplierCompany:String,
supplierProcessedDate:String,

/* PROCESSING */

processingMethod:String,
dryingTemperature:Number,
processingDuration:String,

/* LAB */

labTested:{
type:Boolean,
default:false
},

labName:String,
labResult:String,
labTestDate:String,

/* STATUS */

status:{
type:String,
default:"harvested",
enum:[
"harvested",
"received",
"processing",
"tested",
"packaged",
"distributed"
]
},

/* BLOCKCHAIN */

previousHash:String,
hash:String,

createdAt:{
type:Date,
default:Date.now
}

},{
timestamps:true
})

BatchSchema.methods.generateHash = function(){

const data =
this.batchId +
this.herbName +
this.farmer +
this.quantity +
this.harvestDate +
this.location +
this.previousHash +
Date.now()

return crypto
.createHash("sha256")
.update(data)
.digest("hex")

}

module.exports = mongoose.model("Batch",BatchSchema)