    const express = require("express")
    const router = express.Router()

    const Packet = require("../models/Packet")

    router.post("/packets/create", async(req,res)=>{

    try{

    const {batchId,herbName,totalWeight,packetWeight} = req.body

    const totalPackets = Math.floor(totalWeight/packetWeight)

    let packets=[]

    for(let i=0;i<totalPackets;i++){

    const packetId="PKT"+Date.now()+i

    const packet={

    packetId,
    batchId,
    herbName,
    weight:packetWeight,
    status:"available",
    createdAt:new Date()

    }

    packets.push(packet)

    }

    await Packet.insertMany(packets)

    res.json({
    message:"Packets generated",
    packets
    })

    }catch(err){

    res.status(500).json({error:err.message})

    }

    })

    module.exports = router