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

  useEffect(() => {

    fetch(`${API}/api/batches`)
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          const testedBatches = data.filter((b: any) => b.status === "tested")
          setBatches(testedBatches)
        }

      })
      .catch(err => console.error("Batch fetch error:", err))

  }, [API])


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

    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-emerald-900">
          Packaging & QR Generation
        </h1>
        <p className="text-sm text-emerald-700">
          Create consumer-ready packets and print QR codes for retail distribution.
        </p>
      </div>


      <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

        <h2 className="text-lg font-semibold text-emerald-900 mb-4">Select Batch</h2>

        <select
          className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-emerald-900"
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


      {selectedBatch && (

        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

          <h2 className="text-lg font-semibold text-emerald-900 mb-4">
            Batch Information
          </h2>

          <div className="text-sm text-emerald-700 space-y-1">
            <p><b>Batch ID:</b> {selectedBatch.batchId}</p>
            <p><b>Herb:</b> {selectedBatch.herbName}</p>
            <p><b>Farmer:</b> {selectedBatch.farmer}</p>
            <p><b>Quantity:</b> {selectedBatch.quantity} kg</p>
            <p><b>Location:</b> {selectedBatch.location}</p>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-emerald-700 font-semibold">
              Farmer Batch QR
            </p>

            <QRCodeCanvas
              value={`${BASE}/api/trace/${selectedBatch.batchId}`}
              size={120}
            />
          </div>

          <button
            className="bg-emerald-600 px-4 py-2 rounded-xl mt-6 hover:bg-emerald-700 transition text-white font-semibold"
            onClick={generatePackets}
            disabled={loading}
          >

            {loading ? "Generating..." : "Generate QR Codes"}

          </button>

        </div>
      )}


      {packets.length > 0 && (

        <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-900 mb-4">
            Packet QR Codes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packets.map((packet) => (
              <div key={packet.packetId} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <p className="text-xs text-emerald-700 mb-2">{packet.packetId}</p>
                <QRCodeCanvas value={`${BASE}/api/trace/${packet.packetId}`} size={110} />
                <p className="text-xs text-emerald-600 mt-2">{packet.weight} g</p>
              </div>
            ))}
          </div>

          <button
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-3 rounded-xl mt-6 font-semibold"
            onClick={markAsPackaged}
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Mark Batch as Packaged"}
          </button>
        </div>
      )}

      {message && (
        <div className={`p-4 rounded-xl text-sm ${message.includes("✅") ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
          {message}
        </div>
      )}

    </div>
  )
}
