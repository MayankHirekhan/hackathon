"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      pathname === path
        ? "bg-green-800 text-green-200"
        : "text-green-300 hover:bg-green-900"
    }`;

  return (
    <aside className="w-64 bg-[#062f27] text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold text-green-400 mb-8">
        🌿 HerbTrace
      </h1>

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