

export default function Index() {
  return (
    <div className="flex w-full px-20">
      <div className="flex items-center justify-between w-full">
        <input type="text" placeholder="🔍 Buscar oficina virtual..." className="w-lg h-10 border border-black rounded-lg pl-5 py-5" />
        <button className=" cursor-pointer bg-gray-600 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-gray-500">Pendientes de pago</button>
        <button className="cursor-pointer bg-red-800 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-red-700">Inactivos</button>
        <button className="cursor-pointer bg-blue-800 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-blue-700">Añadir</button>
      </div>
    </div>
  )
}
