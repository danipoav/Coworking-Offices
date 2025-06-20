import ReactPaginate from "react-paginate"

type Empresa = {
    id: string,
    razon_social: string,
    modalidad: string,
    contacto: string,
    titular: string,
    fecha_inicio: string
    fecha_renovacion: string
    renovacion: boolean
    pendiente_pago: boolean
}

type TablaEmpresasProps = {
    datos: Empresa[]
    paginaActual: number
    setPaginaActual: (page: number) => void
    estado: 'activo' | 'inactivo' | 'pendiente'
}

const FILAS_POR_PAGINA = 15

export default function TablaOficinas({ datos, paginaActual, setPaginaActual, estado }: TablaEmpresasProps) {

    const totalPaginas = Math.ceil(datos.length / FILAS_POR_PAGINA)

    const handlePageChange = (event: { selected: number }) => {
        setPaginaActual(event.selected)
    }
    const inicio = paginaActual * FILAS_POR_PAGINA;
    const fin = inicio + FILAS_POR_PAGINA;
    const filasActuales = datos.slice(inicio, fin);

    return (
        <div className="w-full">
            <table className="w-full table-auto border-collapse rounded-lg shadow-lg mb-10">
                <thead>
                    <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
                        <th className="px-4 py-3">Razón Social</th>
                        <th className="px-4 py-3 text-center">Modalidad</th>
                        <th className="px-4 py-3">Contacto</th>
                        <th className="px-4 py-3">Titular</th>
                        <th className="px-4 py-3">{estado === 'activo' || 'pendiente' ? 'Inicio' : estado === 'inactivo' ? 'Fecha de baja' : ''}</th>
                    </tr>
                </thead>
                <tbody className=" text-sm text-gray-800">
                    {filasActuales.map((empresa) => (
                        <tr key={empresa.id} className="">
                            <td className="px-4 py-2 flex items-center gap-2">
                                {estado === 'activo' && (
                                    <span
                                        className={`inline-block w-3.5 h-3.5 rounded-full ${empresa.pendiente_pago ? 'bg-orange-400' : 'bg-green-400'
                                            }`}
                                    />
                                )}

                                {estado === 'inactivo' && (
                                    <span
                                        className={`inline-block w-3.5 h-3.5 rounded-full ${empresa.renovacion ? 'bg-green-400' : 'bg-red-500'
                                            }`}
                                    />
                                )}

                                {estado === 'pendiente' && (
                                    <span
                                        className={`inline-block w-3.5 h-3.5 rounded-full ${empresa.pendiente_pago ? 'bg-gray-400' : ''
                                            }`}
                                    />
                                )}

                                <span>{empresa.razon_social}</span>
                            </td>

                            <td className="px-4 py-1 text-center"><span className={`text-white px-4 py-1 font-semibold  rounded-full text-sm inline-block ${empresa.modalidad === 'Anual' ? ' bg-indigo-500' : empresa.modalidad === 'Semestral' ? 'bg-yellow-500' : ' bg-yellow-900'}`}>{empresa.modalidad}</span></td>
                            <td className="px-4 py-2">{empresa.contacto}</td>
                            <td className="px-4 py-2">{empresa.titular}</td>
                            <td className="px-4 py-2">{estado === 'activo' ? empresa.fecha_inicio : empresa.fecha_renovacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate
                pageCount={totalPaginas}
                forcePage={paginaActual}
                previousLabel={"🡸"}
                nextLabel={"🡺"}
                breakClassName="cursor-pointer"
                containerClassName="flex justify-center mt-4 gap-2 text-sm select-none"
                marginPagesDisplayed={1}
                pageRangeDisplayed={1}
                onPageChange={handlePageChange}
                pageClassName="cursor-pointer"
                pageLinkClassName="px-4 py-2 rounded-md border bg-blue-200 hover:bg-blue-500 hover:text-white hover:border-black shadow transition"
                activeClassName="bg-indigo-600 text-white transition"
                activeLinkClassName="px-4 py-2 rounded-md border border-black bg-blue-500 text-white shadow transition"
                previousClassName="cursor-pointer transition"
                previousLinkClassName="px-4 py-2 rounded-md border bg-white hover:bg-gray-100 shadow transition"
                nextClassName="cursor-pointer transition"
                nextLinkClassName="px-4 py-2 rounded-md border bg-white hover:bg-gray-100 shadow transition"
                disabledClassName="opacity-50 cursor-not-allowed transition"
            />
        </div>
    )
}
