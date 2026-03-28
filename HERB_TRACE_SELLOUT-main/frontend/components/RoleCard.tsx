"use client"

interface Props{
 name:string
 icon:string
 onClick:()=>void
}

export default function RoleCard({name,icon,onClick}:Props){

 return(

  <div
   onClick={onClick}
   className="cursor-pointer bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
  >

   <div className="text-5xl mb-4">
    {icon}
   </div>

   <h2 className="text-lg font-semibold text-green-900">
    {name}
   </h2>

   <p className="text-gray-500 text-sm mt-2">
    Login as {name}
   </p>

  </div>

 )

}