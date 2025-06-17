import { useState } from "react"
import ReactPaginate from "react-paginate"

type Empresa = {
    id: string,
    razon_social: string,
    modalidad: string,
    contacto: string,
    titular: string,
    fecha_inicio: string
    renovacion: boolean
}

type TablaEmpresasProps = {
    datos: Empresa[]
}

const FILAS_POR_PAGINA = 15

export default function TablaOficinas({ datos }: TablaEmpresasProps) {

    const [paginaActual, setPaginaActual] = useState(0)
    const totalPaginas = Math.ceil(datos.length / FILAS_POR_PAGINA)

    const handlePageChange = (event: { selected: number }) => {
        setPaginaActual(event.selected)
    }
    const inicio = paginaActual * FILAS_POR_PAGINA;
    const fin = inicio + FILAS_POR_PAGINA;
    const filasActuales = datos.slice(inicio, fin);

    return (
        <div className="w-full">
            <table className="w-full table-auto border-collapse rounded-lg shadow-md mb-10">
                <thead>
                    <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                        <th className="px-4 py-3">Razón Social</th>
                        <th className="px-4 py-3">Modalidad</th>
                        <th className="px-4 py-3">Contacto</th>
                        <th className="px-4 py-3">Titular</th>
                        <th className="px-4 py-3">Inicio</th>
                    </tr>
                </thead>
                <tbody className=" text-sm text-gray-800">
                    {filasActuales.map((empresa) => (
                        <tr key={empresa.id} className="">
                            <td className="px-4 py-2 flex items-center"><span className={`inline-block w-4 h-4 rounded-full mr-2 ${empresa.renovacion ? 'bg-green-400' : ' bg-orange-400'}`}></span> {empresa.razon_social}</td>
                            <td className="px-4 py-1 text-center"><span className={`text-white px-4 py-1 font-semibold  rounded-full text-sm inline-block ${empresa.modalidad === 'Anual' ? ' bg-indigo-500' : empresa.modalidad === 'Semestral' ? 'bg-yellow-500' : ' bg-yellow-900'}`}>{empresa.modalidad}</span></td>
                            <td className="px-4 py-2">{empresa.contacto}</td>
                            <td className="px-4 py-2">{empresa.titular}</td>
                            <td className="px-4 py-2">{empresa.fecha_inicio}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate
                pageCount={totalPaginas}
                previousLabel={"🡸"}
                nextLabel={"🡺"}
                breakClassName="cursor-pointer"
                containerClassName="flex justify-center mt-4 gap-2 text-sm"
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                pageClassName="cursor-pointer"
                pageLinkClassName="px-4 py-2 rounded-md border bg-blue-200 hover:bg-blue-500 hover:text-white hover:border-black shadow"
                activeClassName="bg-indigo-600 text-white"
                activeLinkClassName="px-4 py-2 rounded-md border border-black bg-blue-500 text-white shadow"
                previousClassName="cursor-pointer"
                previousLinkClassName="px-4 py-2 rounded-md border bg-white hover:bg-gray-100 shadow"
                nextClassName="cursor-pointer"
                nextLinkClassName="px-4 py-2 rounded-md border bg-white hover:bg-gray-100 shadow"
                disabledClassName="opacity-50 cursor-not-allowed"
            />
        </div>
    )
}
