const mongoose = require("mongoose")

const ProductionSchema = new mongoose.Schema({

 farmer:String,
 region:String,
 herb:String,
 month:String,
 quantity:Number

})

module.exports = mongoose.model("Production",ProductionSchema)