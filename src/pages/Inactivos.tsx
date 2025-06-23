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

    if (loading) return <div className="flex items-center justify-center h-[750px]">
        <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Cargando datos, por favor espera...</p>
        </div>
    </div>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="border-b border-gray-400 relative py-4 pt-0">
                <h1 className="text-center text-3xl font-bold text-gray-700 uppercase tracking-widest">
                    Inactivos
                </h1>
                <button
                    onClick={() => navigate("/")}
                    className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform hover:from-blue-500 hover:to-blue-700"
                >
                    <FaArrowLeft className="text-white" />
                    Inicio
                </button>
            </div>
            <div className=" pt-10">
                <TablaOficinas datos={inactivas} paginaActual={paginaActual} setPaginaActual={setPaginaActual} estado="inactivo" rutaDetalle='formsuscribe' />
            </div>

        </div>
    )
}
