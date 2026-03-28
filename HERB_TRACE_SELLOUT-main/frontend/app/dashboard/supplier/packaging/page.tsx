"use client"

import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

interface Batch {
  batchId: string
  herbName: string
  farmer: string
  quantity: number
  location: string
}

interface Packet {
  packetId: string
  batchId: string
  herbName: string
  weight: number
}

export default function PackagingPage() {

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

  const [batches, setBatches] = useState<Batch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [packets, setPackets] = useState<Packet[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  /* ===============================
     LOAD BATCHES
  =============================== */

  useEffect(() => {

    /* Fetch only TESTED batches ready for packaging */
    fetch(`${API}/api/batches`)
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          /* Filter to only show "tested" batches */
          const testedBatches = data.filter((b: any) => b.status === "tested")
          console.log(`📦 Found ${testedBatches.length} batches ready for packaging`)
          setBatches(testedBatches)
        }

      })
      .catch(err => console.error("Batch fetch error:", err))

  }, [API])


  /* ===============================
     GENERATE PACKETS
  =============================== */

  const generatePackets = async () => {

    if (!selectedBatch) return

    setLoading(true)

    try {

      const res = await fetch(`${API}/api/packets/create`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          batchId: selectedBatch.batchId,
          herbName: selectedBatch.herbName,
          totalWeight: selectedBatch.quantity * 1000,
          packetWeight: 250

        })

      })

      const data = await res.json()

      if (data.packets) {
        setPackets(data.packets)
      }

    } catch (err) {

      console.error("Packet generation error:", err)

    }

    setLoading(false)
  }

  /* MARK BATCH AS PACKAGED */
  const markAsPackaged = async () => {
    if (!selectedBatch) return

    setSubmitting(true)
    setMessage("")

    try {
      const res = await fetch(`${API}/api/batches/${selectedBatch.batchId}/package`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      })

      const data = await res.json()

      if (data.success) {
        setMessage(`✅ Batch ${selectedBatch.batchId} marked as packaged!`)
        /* Remove from list and clear */
        setBatches(batches.filter(b => b.batchId !== selectedBatch.batchId))
        setSelectedBatch(null)
        setPackets([])
      } else {
        setMessage(`❌ ${data.message}`)
      }
    } catch (err) {
      console.error("Packaging error:", err)
      setMessage("❌ Error marking batch as packaged")
    }

    setSubmitting(false)
  }


  return (

    <div className="p-8 text-white">

      <h1 className="text-3xl text-green-400 mb-6">
        Packaging & QR Generation
      </h1>


      {/* ===============================
         SELECT BATCH
      =============================== */}

      <div className="bg-[#083d34] p-6 rounded-xl mb-6">

        <h2 className="text-xl mb-4">Select Batch</h2>

        <select
          className="w-full p-3 rounded bg-[#062f27]"
          onChange={(e) => {

            const batch = batches.find(
              b => b.batchId === e.target.value
            )

            if (batch) {
              setSelectedBatch(batch)
              setPackets([])
            }

          }}
        >

          <option>Select Batch</option>

          {batches.map(batch => (

            <option
              key={batch.batchId}
              value={batch.batchId}
            >
              {batch.batchId} - {batch.herbName}
            </option>

          ))}

        </select>

      </div>



      {/* ===============================
         BATCH DETAILS
      =============================== */}

      {selectedBatch && (

        <div className="bg-[#083d34] p-6 rounded-xl mb-6">

          <h2 className="text-xl text-green-400 mb-4">
            Batch Information
          </h2>

          <p><b>Batch ID:</b> {selectedBatch.batchId}</p>
          <p><b>Herb:</b> {selectedBatch.herbName}</p>
          <p><b>Farmer:</b> {selectedBatch.farmer}</p>
          <p><b>Quantity:</b> {selectedBatch.quantity} kg</p>
          <p><b>Location:</b> {selectedBatch.location}</p>


          {/* ===============================
             FARMER BATCH QR
          =============================== */}

          <div className="mt-6">

            <p className="mb-2 text-green-400">
              Farmer Batch QR
            </p>

            <QRCodeCanvas
              value={`${BASE}/api/trace/${selectedBatch.batchId}`}
              size={120}
            />

          </div>


          {/* ===============================
             GENERATE PACKETS BUTTON
          =============================== */}

          <button
            className="bg-green-600 px-4 py-2 rounded mt-6 hover:bg-green-700 transition"
            onClick={generatePackets}
            disabled={loading}
          >

            {loading ? "Generating..." : "Generate QR Codes"}

          </button>

        </div>

      )}



      {/* ===============================
         PACKET QR GRID
      =============================== */}

      {packets.length > 0 && (

        <div className="bg-[#083d34] p-6 rounded-xl">

          <h2 className="text-xl text-green-400 mb-4">
            Generated Packets
          </h2>

          <div className="grid grid-cols-5 gap-4">

            {packets.map(packet => (

              <div
                key={packet.packetId}
                className="bg-[#062f27] p-4 rounded text-center"
              >

                <QRCodeCanvas
                  value={`${BASE}/api/trace/${packet.packetId}`}
                  size={100}
                />

                <p className="text-xs mt-2 break-all">
                  {packet.packetId}
                </p>

              </div>

            ))}

          </div>

        </div>

      )}

      {/* MESSAGE */}
      {message && (
        <div className={`mt-6 p-4 rounded text-center ${
          message.includes("✅") ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
        }`}>
          {message}
        </div>
      )}

      {/* MARK AS PACKAGED BUTTON */}
      {packets.length > 0 && selectedBatch && (
        <div className="mt-6 text-center">
          <button
            onClick={markAsPackaged}
            disabled={submitting}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-8 py-3 rounded font-bold text-white transition"
          >
            {submitting ? "Processing..." : "✅ Mark Batch as Packaged"}
          </button>
          <p className="text-gray-400 text-sm mt-2">Ready to send to distribution</p>
        </div>
      )}

    </div>

  )

}