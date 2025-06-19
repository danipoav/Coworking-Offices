import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEmpresasInactivas } from "../store/empresasSlice";
import TablaOficinas from "../components/TablaOficinas";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function Inactivos() {
    const dispatch = useAppDispatch();
    const { inactivas, loading, error } = useAppSelector((state) => state.empresas)
    const [paginaActual, setPaginaActual] = useState(0)
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(fetchEmpresasInactivas());
    }, [dispatch])

    if (loading) return <p>Cargando empresas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="border-b relative py-4">
                <h1 className="font-bold text-4xl text-center">Inactivos</h1>

                <button
                    onClick={() => navigate("/")}
                    className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform hover:from-blue-500 hover:to-blue-700"
                >
                    <FaArrowLeft className="text-white" />
                    Inicio
                </button>
            </div>
            <div className=" pt-10">
                {inactivas.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg flex flex-col items-center justify-center h-[550px] gap-4">
                        <svg
                            className="w-16 h-16 text-gray-400 animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25m0 0l3 3m-3-3l-3 3M8.25 15v3.75m0 0l3-3m-3 3l-3-3M3 3h18v18H3V3z"
                            />
                        </svg>
                        <span className="text-xl font-semibold text-gray-700">No se encontraron resultados</span>
                        <span className="text-sm text-gray-500">Intenta con otra búsqueda</span>
                    </p>
                ) : (
                    <TablaOficinas datos={inactivas} paginaActual={paginaActual} setPaginaActual={setPaginaActual} estado="inactivo" />
                )}
            </div>

        </div>
    )
}
