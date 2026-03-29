export default function FarmerDashboard(){

 return(

 <div className="space-y-6">

  <div>
   <h1 className="text-3xl font-bold text-emerald-900">
    Farmer Dashboard
   </h1>

   <p className="text-emerald-700">
    Select a section from the sidebar to manage your harvest journey.
   </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

   <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
    <p className="text-sm text-emerald-600">Total Harvests</p>
    <p className="text-3xl font-semibold text-emerald-900 mt-2">12</p>
   </div>

   <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
    <p className="text-sm text-emerald-600">Batches Created</p>
    <p className="text-3xl font-semibold text-emerald-900 mt-2">5</p>
   </div>

   <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
    <p className="text-sm text-emerald-600">QR Codes Generated</p>
    <p className="text-3xl font-semibold text-emerald-900 mt-2">7</p>
   </div>

  </div>

 </div>

 )

}
