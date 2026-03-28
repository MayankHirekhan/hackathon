const express = require("express")
const router = express.Router()

const PDFDocument = require("pdfkit")

const Farmer = require("../models/Farmer")
const Batch = require("../models/Batch")

router.get("/certificate/:farmerId", async (req,res)=>{

 try{

  const farmer = await Farmer.findById(req.params.farmerId)

  if(!farmer){
   return res.status(404).json({error:"Farmer not found"})
  }

  const harvestCount = await Batch.countDocuments({
   farmerId: farmer._id.toString()
  })

  const doc = new PDFDocument()

  res.setHeader("Content-Type","application/pdf")
  res.setHeader(
   "Content-Disposition",
   "attachment; filename=farmer_certificate.pdf"
  )

  doc.pipe(res)

  doc.fontSize(22).text("HERBTRACE AUTHENTICATION",{align:"center"})
  doc.moveDown()

  doc.fontSize(18).text("FARMER AUTHENTICITY CERTIFICATE",{align:"center"})
  doc.moveDown(2)

  doc.fontSize(12)

  doc.text(`Farmer Name : ${farmer.name}`)
  doc.text(`Farm Name   : ${farmer.farmName}`)
  doc.text(`Location    : ${farmer.location}`)
  doc.text(`Experience  : ${farmer.experience} Years`)
  doc.text(`Total Harvests : ${harvestCount}`)

  doc.moveDown()

  doc.text(`Certification ID : CERT-${Math.floor(Math.random()*100000)}`)
  doc.text(`Issued Date : ${new Date().toLocaleDateString()}`)

  doc.moveDown(4)

  doc.text("Authorized By")
  doc.text("HerbTrace Certification Authority")

  doc.end()

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})

module.exports = router