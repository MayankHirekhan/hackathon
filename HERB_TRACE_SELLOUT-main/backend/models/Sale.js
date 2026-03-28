const mongoose = require("mongoose")

const SaleSchema = new mongoose.Schema({

 saleId: {
  type: String,
  required: true,
  unique: true
 },

 /* BATCH & PACKETS */

 batchId: {
  type: String,
  required: true
 },

 packetIds: [{
  type: String
 }],

 /* CUSTOMER INFO */

 customerId: String,
 customerName: {
  type: String,
  required: true
 },

 customerEmail: String,

 customerPhone: String,

 /* SUPPLIER INFO */

 supplierId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Supplier"
 },

 supplierName: String,

 /* SALE DETAILS */

 quantity: Number,

 unit: {
  type: String,
  default: "packet"
 },

 pricePerUnit: Number,

 totalPrice: Number,

 discount: {
  type: Number,
  default: 0
 },

 finalPrice: Number,

 /* PAYMENT & DELIVERY */

 paymentMethod: String,

 paymentStatus: {
  type: String,
  enum: ["pending", "completed", "refunded"],
  default: "completed"
 },

 deliveryAddress: String,

 deliveryDate: Date,

 deliveryStatus: {
  type: String,
  enum: ["pending", "shipped", "delivered", "returned"],
  default: "pending"
 },

 trackingNumber: String,

 /* TIMESTAMPS */

 saleDate: {
  type: Date,
  default: Date.now
 },

 createdAt: {
  type: Date,
  default: Date.now
 }

})

module.exports = mongoose.model("Sale", SaleSchema)
