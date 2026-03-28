   const express = require("express")
   const mongoose = require("mongoose")
   const cors = require("cors")
   const dotenv = require("dotenv")
   const path = require("path")

   dotenv.config()

   const app = express()

   /* ===============================
      MIDDLEWARE
   =============================== */

   app.use(cors())
   app.use(express.json())
   app.use(express.urlencoded({ extended: true }))

   /* ===============================
      STATIC FILES
   =============================== */

   app.use("/uploads", express.static(path.join(__dirname,"uploads")))

   /* ===============================
      DATABASE CONNECTION
   =============================== */

   mongoose.connect(process.env.MONGO_URI)
   .then(()=>console.log("✅ MongoDB Connected Successfully"))
   .catch(err=>console.error("❌ MongoDB Error:",err))

   /* ===============================
      ROUTES IMPORT
   =============================== */

   const farmerRoutes = require("./routes/farmerRoutes")
   const batchRoutes = require("./routes/batchRoutes")
   const analyticsRoutes = require("./routes/analyticsRoutes")
   const productionRoutes = require("./routes/productionRoutes")
   const uploadRoutes = require("./routes/uploadRoutes")
   const userRoutes = require("./routes/userRoutes")
   const certificateRoutes = require("./routes/certificateRoutes")
   const supplierRoutes = require("./routes/supplierRoutes")
   const supplierAnalyticsRoutes = require("./routes/supplierAnalyticsRoutes")
   const processingRoutes = require("./routes/processingRoutes")
   const packetRoutes = require("./routes/packetRoutes")
   const inventoryRoutes = require("./routes/inventoryRoutes")
   const traceRoutes = require("./routes/traceRoutes")
   const receiveRoutes = require("./routes/receiveRoutes")

   const consumerRoutes = require("./routes/consumerRoutes")
   const labRoutes = require("./routes/labRoutes")

   const adminRoutes = require("./routes/adminRoutes")
   const adminAnalyticsRoutes = require("./routes/adminAnalyticsRoutes")

   /* ===============================
      API ROUTES
   =============================== */

   app.use("/api", farmerRoutes)
   app.use("/api", batchRoutes)
   app.use("/api", analyticsRoutes)
   app.use("/api", productionRoutes)
   app.use("/api", uploadRoutes)
   app.use("/api", userRoutes)
   app.use("/api", certificateRoutes)
   app.use("/api", supplierRoutes)
   app.use("/api", supplierAnalyticsRoutes)
   app.use("/api", processingRoutes)
   app.use("/api", packetRoutes)
   app.use("/api", inventoryRoutes)
   app.use("/api", traceRoutes)
   app.use("/api", receiveRoutes)

   app.use("/api", consumerRoutes)
   app.use("/api", labRoutes)

   app.use("/api", adminRoutes)
   app.use("/api", adminAnalyticsRoutes)

   console.log("✅ All API routes loaded")

   /* ===============================
      ROOT
   =============================== */

   app.get("/",(req,res)=>{
   res.send("🌿 HerbTrace Backend Running")
   })

   /* ===============================
      SERVER START
   =============================== */

   const PORT = process.env.PORT || 5000

   app.listen(PORT,()=>{
   console.log(`🚀 Server running on http://localhost:${PORT}`)
   })