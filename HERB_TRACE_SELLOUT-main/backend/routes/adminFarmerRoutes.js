router.get("/admin/farmer/:id",async(req,res)=>{

 const farmer = await Farmer.findById(req.params.id)

 res.json(farmer)

})

router.get("/admin/farmer/:id/batches",async(req,res)=>{

 const batches = await Batch.find({ farmerId:req.params.id })

 res.json(batches)

})

router.get("/admin/farmer/:id/analytics",async(req,res)=>{

 const data = await Batch.aggregate([
 { $match:{ farmerId:req.params.id } },
 {
  $group:{
   _id:"$herbName",
   quantity:{ $sum:"$quantity" }
  }
 },
 {
  $project:{
   herb:"$_id",
   quantity:1,
   _id:0
  }
 }
 ])

 res.json(data)

})