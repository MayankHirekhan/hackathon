const mongoose = require("mongoose")

const ConsumerHistorySchema = new mongoose.Schema({

consumerId:String,

herbName:String,

batchId:String,

farmer:String,

supplier:String,

date:{
type:Date,
default:Date.now
}

})

module.exports =
mongoose.model("ConsumerHistory",ConsumerHistorySchema)