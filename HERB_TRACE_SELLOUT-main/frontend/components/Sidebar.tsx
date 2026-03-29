"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      pathname === path
        ? "bg-emerald-100 text-emerald-900"
        : "text-emerald-700 hover:bg-emerald-50"
    }`;

  return (
    <aside className="w-64 bg-white text-emerald-950 min-h-screen p-6 border-r border-emerald-100">

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-emerald-900">
          🌿 HerbTracking
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
          India Herb Chain
        </p>
      </div>

      <nav className="space-y-2">

        <Link href="/dashboard/supplier" className={linkClass("/dashboard/supplier")}>
          Dashboard
        </Link>

        <Link href="/dashboard/supplier/verify-batch" className={linkClass("/dashboard/supplier/verify-batch")}>
          Verify Batch
        </Link>

        <Link href="/dashboard/supplier/processing" className={linkClass("/dashboard/supplier/processing")}>
          Processing
        </Link>

        <Link href="/dashboard/supplier/inventory" className={linkClass("/dashboard/supplier/inventory")}>
          Inventory
        </Link>

      </nav>

    </aside>
  );
}
