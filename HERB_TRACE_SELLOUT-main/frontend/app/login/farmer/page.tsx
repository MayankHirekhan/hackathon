"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function FarmerLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function login() {
    if (!email || !password) return
    try {
      setLoading(true)
      const res = await fetch("http://localhost:5000/api/farmer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message || "Login failed")
        setLoading(false)
        return
      }
      localStorage.setItem("farmerId", data._id)
      localStorage.setItem("farmerName", data.name)
      router.push("/dashboard/farmer/home")
    } catch (err) {
      console.log(err)
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") login()
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            🌾
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Farmer Login</p>
            <h1 className="text-2xl font-bold text-emerald-900">HerbTracking</h1>
          </div>
        </div>

        <p className="text-sm text-emerald-700 mb-6">
          Sign in to capture harvests, mandi details, and geo-tagged batches.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-emerald-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="farmer@herbtracking.in"
              className="mt-2 w-full rounded-xl border border-emerald-200 px-4 py-3 text-emerald-900"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-emerald-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-emerald-200 px-4 py-3 text-emerald-900"
            />
          </div>
        </div>

        <button
          onClick={login}
          disabled={loading}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <button
          onClick={() => router.push("/login")}
          className="mt-3 w-full border border-emerald-200 text-emerald-700 py-2 rounded-xl text-sm font-semibold"
        >
          Back to role selection
        </button>
      </div>
    </div>
  )
}
