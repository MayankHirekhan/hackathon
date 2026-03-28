const express = require("express")
const router = express.Router()

const Batch = require("../models/Batch")
const Farmer = require("../models/Farmer")

/* =====================================
   FARMER HERB PRODUCTION
===================================== */

router.get("/production/:farmerId", async (req, res) => {

 try {

  const farmerId = req.params.farmerId

  const farmer = await Farmer.findById(farmerId)

  if (!farmer) {
   return res.status(404).json({
    error: "Farmer not found"
   })
  }

  /* FIND ALL BATCHES CREATED BY THIS FARMER */

  const batches = await Batch.find({
   $or: [
    { farmerId: farmer._id },
    { farmer: farmer.name }
   ]
  })

  const herbs = {}
  let totalQuantity = 0

  batches.forEach(b => {

   const herb = b.herbName || "Unknown"
   const qty = Number(b.quantity) || 0

   if (!herbs[herb]) {
    herbs[herb] = 0
   }

   herbs[herb] += qty
   totalQuantity += qty

  })

  res.json({
   herbs,
   totalHarvests: batches.length,
   totalQuantity
  })

 } catch (err) {

  res.status(500).json({
   error: err.message
  })

 }

})



/* =====================================
   REGIONAL FARMER COMPARISON
   FIXED VERSION
===================================== */

router.get("/production/region/:location", async (req, res) => {

 try {

  const location = req.params.location

  /* FIND ALL FARMERS IN THIS REGION */

  const farmers = await Farmer.find({
   location: location
  })

  const farmerNames = farmers.map(f => f.name)

  /* FIND THEIR BATCHES */

  const batches = await Batch.find({
   farmer: { $in: farmerNames }
  })

  const stats = {}

  batches.forEach(b => {

   const farmer = b.farmer || "Unknown"
   const qty = Number(b.quantity) || 0

   if (!stats[farmer]) {
    stats[farmer] = 0
   }

   stats[farmer] += qty

  })

  res.json(stats)

 } catch (err) {

  res.status(500).json({
   error: err.message
  })

 }

})



/* =====================================
   GLOBAL HERB DEMAND ANALYSIS
===================================== */

router.get("/analytics/demand", async (req, res) => {

 try {

  const batches = await Batch.find()

  const herbs = {}

  batches.forEach(b => {

   if (!b.herbName) return

   const herb = b.herbName
   const qty = Number(b.quantity) || 0

   if (!herbs[herb]) {
    herbs[herb] = 0
   }

   herbs[herb] += qty

  })

  const entries = Object.entries(herbs)

  if (entries.length === 0) {

   return res.json({
    herbs: {},
    mostDemanded: null,
    leastDemanded: null
   })

  }

  const mostDemanded = entries.reduce((a, b) =>
   a[1] > b[1] ? a : b
  )

  const leastDemanded = entries.reduce((a, b) =>
   a[1] < b[1] ? a : b
  )

  res.json({
   herbs,
   mostDemanded,
   leastDemanded
  })

 } catch (err) {

  res.status(500).json({
   error: err.message
  })

 }

})

module.exports = router