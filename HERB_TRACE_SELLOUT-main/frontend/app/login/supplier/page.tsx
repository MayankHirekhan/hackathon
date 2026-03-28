"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SupplierLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<"email" | "password" | null>(null)
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 })

  /* ── 3D tilt on mouse move ── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setCardTilt({ x: dy * -8, y: dx * 8 })
  }
  const handleMouseLeave = () => setCardTilt({ x: 0, y: 0 })

  const login = async () => {
    if (!email || !password) return
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/supplier/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("supplierId", data.supplierId)
        router.push("/dashboard/supplier")
      } else {
        alert(data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") login()
  }

  return (
    <div className="min-h-screen bg-[#020f09] flex items-center justify-center overflow-hidden relative">

      {/* ── Background layers ── */}
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-green-500/8 blur-[120px] rounded-full pointer-events-none" />
      {/* Radial glow bottom-right */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-emerald-900/20 blur-[100px] rounded-full pointer-events-none" />
      {/* Corner hex decorations */}
      <svg className="absolute top-8 left-8 opacity-10 w-24 h-24" viewBox="0 0 96 96">
        <polygon points="48,4 92,26 92,70 48,92 4,70 4,26" fill="none" stroke="#4ade80" strokeWidth="1" />
        <polygon points="48,16 80,33 80,63 48,80 16,63 16,33" fill="none" stroke="#4ade80" strokeWidth="0.5" />
      </svg>
      <svg className="absolute bottom-8 right-8 opacity-10 w-16 h-16" viewBox="0 0 64 64">
        <polygon points="32,4 60,18 60,46 32,60 4,46 4,18" fill="none" stroke="#34d399" strokeWidth="1" />
      </svg>

      {/* ── 3D Card wrapper ── */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{
          perspective: "1000px",
          animation: "fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) both",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          style={{
            transform: `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
            transition: cardTilt.x === 0 ? "transform 0.6s cubic-bezier(0.23,1,0.32,1)" : "transform 0.1s linear",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Outer glow border */}
          <div className="absolute -inset-px rounded-[24px] bg-gradient-to-b from-green-500/25 via-emerald-900/10 to-transparent pointer-events-none" />

          {/* Card */}
          <div
            className="relative rounded-[24px] border border-green-900/50 bg-[#040f09] px-10 py-10"
            style={{
              boxShadow: `
                0 0 0 1px rgba(74,222,128,0.08),
                0 30px 80px -20px rgba(0,0,0,0.8),
                0 0 120px -40px rgba(74,222,128,0.15)
              `,
            }}
          >
            {/* Top status pill */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-green-500/70 font-mono uppercase">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Blockchain Verified
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-green-900/50 text-green-800">
                MAINNET
              </span>
            </div>

            {/* Logo */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full">
                    <polygon points="28,4 52,16 52,40 28,52 4,40 4,16" fill="none" stroke="#4ade80" strokeWidth="1.2" opacity="0.7" />
                    <polygon points="28,10 46,19 46,37 28,46 10,37 10,19" fill="#071f14" stroke="#166534" strokeWidth="0.8" />
                  </svg>
                  <span className="text-lg z-10">🌿</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black tracking-tight">
                    Herb<span className="text-green-400">Trace</span>
                  </span>
                </div>
              </div>

              {/* Role badge */}
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full border border-[#34d399]/30 bg-[#34d399]/5">
                <span className="text-base">📦</span>
                <span className="text-[11px] tracking-[0.2em] font-mono text-[#34d399] uppercase">Supplier Portal</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-green-900/40 to-transparent mb-8" />

            {/* Form */}
            <div className="space-y-4">

              {/* Email */}
              <div className="relative">
                <label className="block text-[10px] tracking-[0.18em] font-mono text-green-800 uppercase mb-1.5 ml-1">
                  Email Address
                </label>
                <div
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: focused === "email"
                      ? "0 0 0 1.5px #34d399, 0 0 20px -5px rgba(52,211,153,0.3)"
                      : "0 0 0 1px rgba(74,222,128,0.12)",
                  }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 text-sm pointer-events-none">
                    ✉
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onKeyDown={handleKeyDown}
                    placeholder="supplier@herbtrace.io"
                    className="w-full bg-[#060f0a] text-green-100 placeholder-green-900 text-sm pl-10 pr-4 py-3.5 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-[10px] tracking-[0.18em] font-mono text-green-800 uppercase mb-1.5 ml-1">
                  Password
                </label>
                <div
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: focused === "password"
                      ? "0 0 0 1.5px #34d399, 0 0 20px -5px rgba(52,211,153,0.3)"
                    : "0 0 0 1px rgba(74,222,128,0.12)",
                  }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 text-sm pointer-events-none">
                    🔒
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••••••"
                    className="w-full bg-[#060f0a] text-green-100 placeholder-green-900 text-sm pl-10 pr-4 py-3.5 outline-none font-mono tracking-widest"
                  />
                </div>
              </div>

              {/* Login button */}
              <button
                onClick={login}
                disabled={loading}
                className="relative w-full mt-2 rounded-xl py-3.5 font-bold text-sm tracking-[0.12em] uppercase overflow-hidden transition-all duration-300 group"
                style={{
                  background: loading
                    ? "linear-gradient(135deg, #14532d, #166534)"
                    : "linear-gradient(135deg, #16a34a, #15803d)",
                  boxShadow: loading ? "none" : "0 8px 32px -8px rgba(22,163,74,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                  transform: loading ? "scale(0.98)" : "scale(1)",
                }}
              >
                {/* Shimmer sweep on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative z-10 text-white flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Access Portal
                      <span className="text-base">→</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Back link */}
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push("/login")}
                className="text-[11px] font-mono text-green-900 hover:text-green-600 tracking-[0.15em] uppercase transition-colors duration-200"
              >
                ← Back to Role Select
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-green-900/20 text-center text-[10px] font-mono text-green-900/40 tracking-widest">
              END-TO-END ENCRYPTED · LOGISTICS MODULE
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  )
}