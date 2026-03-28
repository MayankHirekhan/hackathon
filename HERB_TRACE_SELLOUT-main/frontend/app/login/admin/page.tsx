"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<"email" | "password" | null>(null)
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    setCardTilt({ x: dy * -8, y: dx * 8 })
  }
  const handleMouseLeave = () => setCardTilt({ x: 0, y: 0 })

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    // Slight delay to show loading state before push
    await new Promise(r => setTimeout(r, 400))
    router.push("/dashboard/admin")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  /* Admin accent: cool silver-white (#d1fae5 → pale mint) */
  const accent = "#d1fae5"
  const accentGlow = "rgba(209,250,229,0.2)"

  return (
    <div className="min-h-screen bg-[#020f09] flex items-center justify-center overflow-hidden relative text-white">

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #4ade80 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] blur-[120px] rounded-full pointer-events-none bg-emerald-300/4" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] rounded-full pointer-events-none bg-slate-900/40" />

      {/* Corner hex decorations */}
      <svg className="absolute top-8 left-8 opacity-10 w-24 h-24" viewBox="0 0 96 96">
        <polygon points="48,4 92,26 92,70 48,92 4,70 4,26" fill="none" stroke={accent} strokeWidth="1" />
        <polygon points="48,16 80,33 80,63 48,80 16,63 16,33" fill="none" stroke={accent} strokeWidth="0.5" />
      </svg>
      <svg className="absolute top-8 right-8 opacity-10 w-16 h-16" viewBox="0 0 64 64">
        <polygon points="32,4 60,18 60,46 32,60 4,46 4,18" fill="none" stroke={accent} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-8 left-8 opacity-[0.07] w-16 h-16" viewBox="0 0 64 64">
        <polygon points="32,4 60,18 60,46 32,60 4,46 4,18" fill="none" stroke={accent} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-8 right-8 opacity-10 w-24 h-24" viewBox="0 0 96 96">
        <polygon points="48,4 92,26 92,70 48,92 4,70 4,26" fill="none" stroke={accent} strokeWidth="1" />
      </svg>

      {/* 3D Card */}
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
          {/* Outer glow border — silver/mint for admin */}
          <div
            className="absolute -inset-px rounded-[24px] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(209,250,229,0.15), rgba(100,150,120,0.05), transparent)",
            }}
          />

          {/* Card body */}
          <div
            className="relative rounded-[24px] border bg-[#040f09] px-10 py-10"
            style={{
              borderColor: "rgba(209,250,229,0.12)",
              boxShadow: `
                0 0 0 1px rgba(209,250,229,0.05),
                0 30px 80px -20px rgba(0,0,0,0.9),
                0 0 140px -40px ${accentGlow}
              `,
            }}
          >
            {/* Status bar */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-green-500/70 font-mono uppercase">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Blockchain Verified
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded border text-green-800"
                  style={{ borderColor: "rgba(209,250,229,0.15)" }}
                >
                  MAINNET
                </span>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded border"
                  style={{ borderColor: "rgba(209,250,229,0.2)", color: accent, background: "rgba(209,250,229,0.04)" }}
                >
                  ADMIN
                </span>
              </div>
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
                <span className="text-2xl font-black tracking-tight">
                  Herb<span className="text-green-400">Trace</span>
                </span>
              </div>

              {/* Role badge — admin pale mint */}
              <div
                className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full border"
                style={{ borderColor: accent + "35", background: "rgba(209,250,229,0.04)" }}
              >
                <span className="text-base">🛡️</span>
                <span className="text-[11px] tracking-[0.2em] font-mono uppercase" style={{ color: accent }}>
                  Admin Portal
                </span>
              </div>

              {/* Admin-only warning line */}
              <p className="mt-3 text-[10px] font-mono tracking-widest text-green-900/60">
                RESTRICTED ACCESS · AUTHORISED PERSONNEL ONLY
              </p>
            </div>

            {/* Divider */}
            <div
              className="h-px mb-8"
              style={{ background: "linear-gradient(90deg, transparent, rgba(209,250,229,0.15), transparent)" }}
            />

            {/* Form */}
            <div className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-[10px] tracking-[0.18em] font-mono text-green-800 uppercase mb-1.5 ml-1">
                  Admin Email
                </label>
                <div
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: focused === "email"
                      ? `0 0 0 1.5px ${accent}, 0 0 24px -5px ${accentGlow}`
                      : "0 0 0 1px rgba(209,250,229,0.08)",
                  }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 text-sm pointer-events-none">✉</div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    onKeyDown={handleKeyDown}
                    placeholder="admin@herbtrace.io"
                    className="w-full bg-[#060f0a] text-green-100 placeholder-green-900 text-sm pl-10 pr-4 py-3.5 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] tracking-[0.18em] font-mono text-green-800 uppercase mb-1.5 ml-1">
                  Password
                </label>
                <div
                  className="relative rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    boxShadow: focused === "password"
                      ? `0 0 0 1.5px ${accent}, 0 0 24px -5px ${accentGlow}`
                      : "0 0 0 1px rgba(209,250,229,0.08)",
                  }}
                >
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 text-sm pointer-events-none">🔒</div>
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

              {/* Login button — slightly cooler gradient for admin */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="relative w-full mt-2 rounded-xl py-3.5 font-bold text-sm tracking-[0.12em] uppercase overflow-hidden transition-all duration-300 group"
                style={{
                  background: loading
                    ? "linear-gradient(135deg, #1a3a2a, #1e4a34)"
                    : "linear-gradient(135deg, #14532d, #166534, #15803d)",
                  boxShadow: loading
                    ? "none"
                    : `0 8px 32px -8px rgba(20,83,45,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(209,250,229,0.1)`,
                  transform: loading ? "scale(0.98)" : "scale(1)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 text-white flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>Access Control Panel <span className="text-base">→</span></>
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
            <div className="mt-6 pt-6 border-t text-center text-[10px] font-mono text-green-900/40 tracking-widest"
              style={{ borderColor: "rgba(209,250,229,0.08)" }}>
              END-TO-END ENCRYPTED · CONTROL MODULE
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