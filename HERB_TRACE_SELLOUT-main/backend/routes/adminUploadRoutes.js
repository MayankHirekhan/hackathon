const express = require("express")
const router = express.Router()
const multer = require("multer")

const storage = multer.diskStorage({

 destination:(req,file,cb)=>{
  cb(null,"uploads/admin")
 },

 filename:(req,file,cb)=>{
  cb(null,Date.now()+"-"+file.originalname)
 }

})

const upload = multer({storage})

router.post("/admin/upload-photo",upload.single("photo"),(req,res)=>{

 res.json({
  image:`/uploads/admin/${req.file.filename}`
 })

})

module.exports = router