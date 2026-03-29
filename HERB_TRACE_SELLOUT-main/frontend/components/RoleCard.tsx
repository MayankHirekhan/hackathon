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
    className="cursor-pointer bg-white rounded-2xl p-6 text-center shadow-sm border border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition duration-300"
   >

    <div className="text-4xl mb-3">
     {icon}
    </div>

    <h2 className="text-lg font-semibold text-emerald-900">
     {name}
    </h2>

    <p className="text-emerald-700 text-sm mt-2">
     Continue as {name}
    </p>

   </div>

  )

}
