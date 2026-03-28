const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")

/* ===============================
   ENSURE UPLOAD FOLDER EXISTS
=============================== */

const uploadDir = path.join(__dirname, "../uploads")

if (!fs.existsSync(uploadDir)) {
 fs.mkdirSync(uploadDir)
}

/* ===============================
   STORAGE CONFIG
=============================== */

const storage = multer.diskStorage({

 destination: (req, file, cb) => {
  cb(null, uploadDir)
 },

 filename: (req, file, cb) => {

  const uniqueName =
   Date.now() +
   "-" +
   Math.round(Math.random() * 1E9) +
   path.extname(file.originalname)

  cb(null, uniqueName)
 }

})

/* ===============================
   FILE TYPE VALIDATION
=============================== */

const fileFilter = (req, file, cb) => {

 const allowedTypes = /jpg|jpeg|png|webp/

 const ext = allowedTypes.test(
  path.extname(file.originalname).toLowerCase()
 )

 const mime = allowedTypes.test(file.mimetype)

 if (ext && mime) {
  return cb(null, true)
 }

 cb(new Error("Only image files allowed"))
}

/* ===============================
   MULTER CONFIG
=============================== */

const upload = multer({

 storage,

 limits: {
  fileSize: 2 * 1024 * 1024 // 2MB
 },

 fileFilter

})

/* ===============================
   PROFILE IMAGE UPLOAD
=============================== */

router.post(
 "/upload/profile",
 upload.single("image"),
 (req, res) => {

 try {

  if (!req.file) {
   return res.status(400).json({
    success: false,
    message: "No image uploaded"
   })
  }

  res.json({

   success: true,

   message: "Profile image uploaded",

   path: `/uploads/${req.file.filename}`

  })

 } catch (err) {

  res.status(500).json({
   success: false,
   error: err.message
  })

 }

})

module.exports = router