import ReactPaginate from "react-paginate"
import type { TablaEmpresasProps } from "../interfaces/TablaEmpresasProps"
import { useAppDispatch } from "../store/hooks"
import type { Empresa } from "../interfaces/Empresa"
import { setEmpresaSeleccionada } from "../store/empresasSlice"
import { useNavigate } from 'react-router-dom'
import { FaRegCopy } from "react-icons/fa6";
import { toast } from "react-toastify"


const FILAS_POR_PAGINA = 15

export default function TablaOficinas({ datos, paginaActual, setPaginaActual, estado, rutaDetalle }: TablaEmpresasProps) {

    const totalPaginas = Math.ceil(datos.length / FILAS_POR_PAGINA)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleSeleccion = (empresa: Empresa) => {
        dispatch(setEmpresaSeleccionada(empresa))
        if (rutaDetalle) {
            navigate(`/${rutaDetalle}`)
        }
    }
    // const handlePageChange = (event: { selected: number }) => {
    //     setPaginaActual(event.selected)
    // }
    // const inicio = paginaActual * FILAS_POR_PAGINA;
    // const fin = inicio + FILAS_POR_PAGINA;
    // const filasActuales = datos.slice(inicio, fin);

    return (
        <div className="w-full border border-gray-300 rounded-md overflow-hidden shadow-sm">
            <table className="table-fixed w-full border-collapse">
                <thead className="bg-gray-200 text-gray-700 text-sm font-semibold">
                    <tr>
                        <th className="px-4 py-2 w-[250px] text-left">Empresa {<FaRegCopy className=" cursor-pointer mb-1 inline-block"
                            onClick={() => {
                                const razones = datos.map(e => e.razon_social).join('\n')
                                navigator.clipboard.writeText(razones)
                                    .then(() => toast.success('Copiado', { autoClose: 2000 }))
                            }} />}</th>
                        <th className="px-4 py-2 w-[120px] text-center">Modalidad</th>
                        <th className="px-4 py-2 w-[180px] text-left">Contacto</th>
                        <th className="px-4 py-2 w-[180px] text-left">Titular</th>
                        <th className="px-4 py-2 w-[130px] text-center">Fecha</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                    {datos.map((empresa) => (
                        <tr
                            key={empresa.id}
                            className="hover:bg-blue-50 cursor-pointer"
                            onClick={() => handleSeleccion(empresa)}
                        >
                            <td className="px-4 py-2 w-[250px]">
                                <div className="flex items-center gap-2">
                                    {/* Semáforo */}
                                    <span className={`inline-block w-3.5 h-3.5 rounded-full ${estado === 'activo'
                                        ? empresa.pendiente_pago ? 'bg-orange-400' : 'bg-green-400'
                                        : estado === 'inactivo'
                                            ? empresa.renovacion ? 'bg-green-400' : 'bg-red-500'
                                            : 'bg-gray-400'
                                        }`} />
                                    {/* Razon Social */}
                                    <span className="truncate max-w-[350px] overflow-hidden whitespace-nowrap block">
                                        {empresa.razon_social.toUpperCase()}
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-1 text-center w-[120px]">
                                <span className={`text-white px-4 py-1 font-semibold rounded-full text-sm inline-block ${empresa.modalidad === 'Anual'
                                    ? 'bg-indigo-500'
                                    : empresa.modalidad === 'Semestral'
                                        ? 'bg-yellow-500'
                                        : 'bg-yellow-900'
                                    }`}>
                                    {empresa.modalidad}
                                </span>
                            </td>

                            <td className="px-4 py-2 w-[180px] truncate">{empresa.contacto}</td>
                            <td className="px-4 py-2 w-[180px] truncate">{empresa.titular}</td>

                            <td className="px-4 py-2 w-[130px] text-center">
                                {(estado === 'activo' || estado === 'pendiente') ? empresa.fecha_inicio : empresa.fecha_renovacion}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <ReactPaginate
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
            /> */}
        </div>
    )
}
