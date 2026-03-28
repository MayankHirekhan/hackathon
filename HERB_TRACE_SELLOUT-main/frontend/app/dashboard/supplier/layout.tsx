export default function SupplierLayout({
 children,
}:{
 children:React.ReactNode
}){

return(

<div className="flex min-h-screen bg-[#041f1a] text-white">

{/* SIDEBAR */}

<div className="w-64 bg-[#062f27] p-6">

<h1 className="text-green-400 text-xl font-bold mb-6">
🌿 HerbTrace
</h1>

<nav className="space-y-4">

<a href="/dashboard/supplier" className="block hover:text-green-400">
Dashboard
</a>

<a href="/dashboard/supplier/receive" className="block hover:text-green-400">
Receive Batch
</a>

<a href="/dashboard/supplier/processing" className="block hover:text-green-400">
Processing Log
</a>

<a href="/dashboard/supplier/packaging" className="block hover:text-green-400">
Packaging
</a>

<a href="/dashboard/supplier/inventory" className="block hover:text-green-400">
Inventory
</a>

</nav>

</div>

{/* CONTENT */}

<div className="flex-1 p-8">

<div className="bg-green-800 p-4 rounded mb-6">
Supply Chain Tracking
</div>

{children}

</div>

</div>

)

}