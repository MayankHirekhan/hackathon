export default function FarmerDashboard(){

 return(

 <div>

  <h1 className="text-3xl font-bold mb-4">
   Farmer Dashboard
  </h1>

  <p className="text-gray-400 mb-10">
   Select a section from the sidebar.
  </p>

  <div className="grid grid-cols-3 gap-6">

   <div className="bg-[#062c21] border border-[#134e3a] rounded-xl p-6">
    <h2>Total Harvests</h2>
    <p className="text-3xl text-green-400 mt-2">12</p>
   </div>

   <div className="bg-[#062c21] border border-[#134e3a] rounded-xl p-6">
    <h2>Batches Created</h2>
    <p className="text-3xl text-green-400 mt-2">5</p>
   </div>

   <div className="bg-[#062c21] border border-[#134e3a] rounded-xl p-6">
    <h2>QR Codes Generated</h2>
    <p className="text-3xl text-green-400 mt-2">7</p>
   </div>

  </div>

 </div>

 )

}