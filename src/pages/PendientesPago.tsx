import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEmpresas } from "../store/empresasSlice";
import TablaOficinas from "../components/TablaOficinas";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function PendientesPago() {
    const dispatch = useAppDispatch();
    const { empresas, loading, error } = useAppSelector((state) => state.empresas)
    const [paginaActual, setPaginaActual] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(fetchEmpresas());
    }, [dispatch])

    // Funcion para parsear las fechas en europea
    const parseFechaEuropea = (fechaStr: string): Date => {
        const [dia, mes, año] = fechaStr.split("-").map(Number);
        return new Date(año, mes - 1, dia);
    };
    // Aqui solo filtro las fechas que estan pendientes de pago
    const empresasPendientes = empresas.filter(item => item.pendiente_pago);
    // Recojo las fechas que no sean isNan para que no haya probelmas
    const empresasValidas = empresasPendientes.filter((item) => {
        const fecha = parseFechaEuropea(item.fecha_inicio)
        return !isNaN(fecha.getTime())
    })
    // Recojo en un array las fechas que contienen empresas pedientes de pago, para que no salgan todos los meses y hayan meses vacios sin datosFiltrados, solo los necesarios
    const availableMonths = Array.from(
        new Set(
            empresasValidas.map((item) => {
                const fecha = parseFechaEuropea(item.fecha_inicio)
                return `${fecha.getFullYear()}-${fecha.getMonth()}`
            })
        )
    ).sort().reverse()
    //Creo un diccionario con si clave y valor de los meses para usarlo en el select
    const monthLabels: Record<string, string> = {
        "0": "Enero", "1": "Febrero", "2": "Marzo", "3": "Abril",
        "4": "Mayo", "5": "Junio", "6": "Julio", "7": "Agosto",
        "8": "Septiembre", "9": "Octubre", "10": "Noviembre", "11": "Diciembre"
    };
    //Basicamente si el select esta vacio me devuelve todos los datos y si el select tiene seleccionado algo que me devuelva lo que tiene seleccionado
    const datosFiltrados = selectedMonth
        ? empresasValidas.filter((item) => {
            const fecha = parseFechaEuropea(item.fecha_inicio)
            const clave = `${fecha.getFullYear()}-${fecha.getMonth()}`;
            return clave === selectedMonth;
        }) : empresasValidas


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
                    Pendientes de pago
                </h1>
                <button
                    onClick={() => navigate("/")}
                    className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform hover:from-blue-500 hover:to-blue-700"
                >
                    <FaArrowLeft className="text-white" />
                    Inicio
                </button>
            </div>
            <div className="mt-6">
                <select
                    value={selectedMonth}
                    onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        setPaginaActual(0);
                    }}
                    className=" cursor-pointer appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 shadow-sm bg-white text-gray-800 font-medium text-base leading-6 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 relative"
                >
                    <option value="">Todos los meses</option>
                    {availableMonths.map((key) => {
                        const [año, mes] = key.split("-");
                        return (
                            <option key={key} value={key}>
                                {`${monthLabels[mes]} ${año}`}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className=" pt-5">
                <TablaOficinas datos={datosFiltrados} paginaActual={paginaActual} setPaginaActual={setPaginaActual} estado="pendiente" />
            </div>

        </div>
    )
}
