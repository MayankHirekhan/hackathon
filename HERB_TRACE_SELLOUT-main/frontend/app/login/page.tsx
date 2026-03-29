"use client"

import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const roles = [
    { name: "Farmer",     desc: "Capture harvests & farm data",  icon: "🌾", route: "/login/farmer",   role: "farmer" },
    { name: "Supplier",   desc: "Process, pack & distribute",    icon: "📦", route: "/login/supplier", role: "supplier" },
    { name: "Lab Tester", desc: "Verify quality & compliance",   icon: "🧪", route: "/login/lab",      role: "lab" },
    { name: "Consumer",   desc: "Trace herb origins instantly",  icon: "🛒", route: "/login/consumer", role: "consumer" },
    { name: "Admin",      desc: "Oversee the national network",  icon: "🛡️", route: "/login/admin",    role: "admin" },
  ]

  function handleRoleClick(role: (typeof roles)[0]) {
    localStorage.removeItem("farmerId")
    localStorage.removeItem("supplierId")
    localStorage.removeItem("consumerId")
    localStorage.removeItem("adminId")
    localStorage.setItem("loginRole", role.role)
    router.push(role.route)
  }

  return (
    <div className="min-h-screen bg-emerald-50 text-emerald-950">
      <div className="max-w-6xl mx-auto px-6 py-14 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">HerbTracking Network</p>
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 mt-3">
              Choose your role to enter India’s herb supply chain.
            </h1>
            <p className="text-emerald-700 mt-3 max-w-2xl">
              Built for farmers, processors, labs, and consumers to keep every Ayurvedic herb transparent and trusted.
            </p>
          </div>
          <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-emerald-800">Need to verify a batch?</p>
            <p className="text-xs text-emerald-600">Use the homepage quick trace to scan the QR.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {roles.map((role) => (
            <button
              key={role.name}
              onClick={() => handleRoleClick(role)}
              className="text-left bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-3xl">{role.icon}</div>
              <h2 className="text-lg font-semibold text-emerald-900 mt-4">{role.name}</h2>
              <p className="text-sm text-emerald-700 mt-2">{role.desc}</p>
              <p className="text-xs text-emerald-600 mt-4 uppercase tracking-[0.2em]">Enter</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
