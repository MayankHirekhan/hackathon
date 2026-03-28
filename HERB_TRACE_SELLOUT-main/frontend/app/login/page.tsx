"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ── Matrix rain canvas (bug fix: cols is a number, iterate with index loop) ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコサシスセソタチツテト♦◆█▓▒░"
    const fontSize = 13
    // FIX: cols is a plain number — use a for loop, not forEach
    let cols = Math.floor(canvas.width / fontSize)
    let drops: number[] = Array.from({ length: cols }, () => Math.random() * -80)

    let raf: number
    const draw = () => {
      ctx.fillStyle = "rgba(2, 15, 9, 0.18)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const y = drops[i] * fontSize

        if (drops[i] > 0) {
          ctx.font = `${fontSize}px monospace`
          ctx.fillStyle = "rgba(180, 255, 210, 0.85)"
          ctx.fillText(char, i * fontSize, y)
          ctx.fillStyle = "rgba(34, 197, 94, 0.25)"
          const bodyChar = chars[Math.floor(Math.random() * chars.length)]
          ctx.fillText(bodyChar, i * fontSize, y - fontSize)
        }

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 0.5
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.floor(canvas.width / fontSize)
      drops = Array.from({ length: cols }, () => Math.random() * -80)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const roles = [
    { name: "Farmer",     desc: "Manage crops & harvests",  icon: "🌾", route: "/login/farmer",   role: "farmer",   accent: "#4ade80", tag: "PRODUCER"  },
    { name: "Supplier",   desc: "Track & distribute stock", icon: "📦", route: "/login/supplier", role: "supplier", accent: "#34d399", tag: "LOGISTICS" },
    { name: "Lab Tester", desc: "Verify herb quality",      icon: "🧪", route: "/login/lab",      role: "lab",      accent: "#6ee7b7", tag: "QUALITY"   },
    { name: "Consumer",   desc: "Trace herb origins",       icon: "🔎", route: "/login/consumer", role: "consumer", accent: "#a7f3d0", tag: "VERIFY"    },
    { name: "Admin",      desc: "Oversee the network",      icon: "🛡️", route: "/login/admin",    role: "admin",    accent: "#d1fae5", tag: "CONTROL"   },
  ]

  function handleRoleClick(role: (typeof roles)[0], index: number) {
    setClickedIndex(index)
    localStorage.removeItem("farmerId")
    localStorage.removeItem("supplierId")
    localStorage.removeItem("consumerId")
    localStorage.removeItem("adminId")
    localStorage.setItem("loginRole", role.role)
    setTimeout(() => router.push(role.route), 350)
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center overflow-hidden relative bg-[#020f09]">

      {/* Matrix canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }} />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_20%,#020f09_100%)]" />

      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-green-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* Main panel */}
      <div
        className="relative z-10 w-full max-w-[1160px] mx-4"
        style={{ animation: "fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-green-500/20 via-green-900/5 to-transparent pointer-events-none" />
        <div className="relative rounded-[28px] border border-green-900/50 bg-[#040f09] px-12 py-14 shadow-[0_0_140px_-30px_rgba(74,222,128,0.12)]">

          {/* Status bar */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-green-500/70 font-mono uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Blockchain Verified
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded border border-green-900/60 text-green-700">MAINNET</span>
              <span className="text-green-900">v2.4.1</span>
            </div>
          </div>

          {/* Logo */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-5">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full">
                  <polygon points="28,4 52,16 52,40 28,52 4,40 4,16" fill="none" stroke="#4ade80" strokeWidth="1.2" opacity="0.7" />
                  <polygon points="28,10 46,19 46,37 28,46 10,37 10,19" fill="#071f14" stroke="#166534" strokeWidth="0.8" />
                </svg>
                <span className="text-2xl z-10">🌿</span>
              </div>
              <div className="text-left">
                <h1 className="text-[42px] leading-none font-black tracking-tight">
                  Herb<span className="text-green-400">Trace</span>
                </h1>
                <p className="text-[10px] tracking-[0.25em] text-green-700 uppercase mt-0.5 font-mono">
                  Supply Chain Intelligence
                </p>
              </div>
            </div>
            <p className="text-green-900 text-sm tracking-[0.3em] uppercase font-mono">
              — Select your access role to continue —
            </p>
          </div>

          {/* Role cards — always show accent-coloured border */}
          <div className="grid grid-cols-5 gap-4">
            {roles.map((role, index) => {
              const isHovered = hoveredIndex === index
              const isClicked = clickedIndex === index
              return (
                <button
                  key={index}
                  onClick={() => handleRoleClick(role, index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative group text-left rounded-2xl overflow-hidden focus:outline-none transition-all duration-300"
                  style={{
                    /* Always-on coloured border via box-shadow so it never disappears */
                    boxShadow: isHovered
                      ? `0 0 0 1.5px ${role.accent}, 0 20px 60px -10px ${role.accent}33, inset 0 1px 0 ${role.accent}33`
                      : `0 0 0 1px ${role.accent}40`,
                    background: isHovered
                      ? `linear-gradient(145deg, #071f14, #0a2d1c)`
                      : "#050e09",
                    transform: isClicked
                      ? "scale(0.97)"
                      : isHovered
                      ? "translateY(-4px)"
                      : "translateY(0)",
                  }}
                >
                  {/* Top accent line — always visible, brighter on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${role.accent}, transparent)`,
                      opacity: isHovered ? 1 : 0.45,
                    }}
                  />

                  {/* Click shimmer */}
                  {isClicked && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-shimmer" />
                  )}

                  <div className="p-7">
                    <div
                      className="text-[9px] tracking-[0.2em] font-mono mb-4 transition-colors duration-300"
                      style={{ color: isHovered ? role.accent : role.accent + "70" }}
                    >
                      {role.tag}
                    </div>
                    <div
                      className="text-3xl mb-5 transition-transform duration-300"
                      style={{ transform: isHovered ? "scale(1.15)" : "scale(1)" }}
                    >
                      {role.icon}
                    </div>
                    <h2
                      className="text-base font-bold mb-1.5 transition-colors duration-300"
                      style={{ color: isHovered ? role.accent : "#e2f5eb" }}
                    >
                      {role.name}
                    </h2>
                    <p
                      className="text-[11px] leading-relaxed transition-colors duration-300"
                      style={{ color: isHovered ? "#6ee7b7" : "#1a4a2e" }}
                    >
                      {role.desc}
                    </p>
                    <div
                      className="mt-5 flex items-center gap-1 text-[10px] font-mono transition-all duration-300"
                      style={{
                        color: role.accent,
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "translateX(0)" : "translateX(-6px)",
                      }}
                    >
                      ENTER <span className="text-base leading-none">→</span>
                    </div>
                  </div>

                  {/* Corner arrow */}
                  <div
                    className="absolute bottom-3 right-3 w-6 h-6 transition-opacity duration-300"
                    style={{ opacity: isHovered ? 0.4 : 0.1 }}
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 20 L20 4" stroke={role.accent} strokeWidth="1" />
                      <path d="M14 4 L20 4 L20 10" stroke={role.accent} strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-green-900/20 flex items-center justify-between text-[10px] font-mono text-green-900/50">
            <div className="flex items-center gap-4">
              <span>END-TO-END ENCRYPTED</span>
              <span className="w-px h-3 bg-green-900/40" />
              <span>PRIVACY POLICY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
              <span>ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%);  }
        }
        .animate-shimmer { animation: shimmer 0.6s ease-in-out; }
      `}</style>
    </div>
  )
}