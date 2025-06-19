import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TablaOficinas from '../components/TablaOficinas';
import { IoPersonAdd } from "react-icons/io5";
import { TbTimeDurationOff } from "react-icons/tb";
import { MdOutlinePendingActions } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEmpresas } from '../store/empresasSlice';

export default function Index() {
  const [indiceMes, setIndiceMes] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { empresas, loading, error } = useAppSelector((state) => state.empresas)

  useEffect(() => {
    dispatch(fetchEmpresas())
  }, [dispatch]);



  if (loading) return <div className="flex items-center justify-center h-[750px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg font-medium">Cargando datos, por favor espera...</p>
    </div>
  </div>;
  if (error) return <div>{error}</div>;
  if (empresas.length === 0) return <div>No se encontraron empresas</div>;

  // {Funcion para que me transforme las fechas a fechas Europeas, por tema de meses}
  const parseFechaEuropea = (fechaStr: string): Date => {
    const [dia, mes, año] = fechaStr.split("-").map(Number);
    return new Date(año, mes - 1, dia)
  }
  // {Me filtra primero las empresas que no tengan una fecha invalida (NaN)}
  const empresasValidas = empresas.filter((item) => {
    const fecha = parseFechaEuropea(item.fecha_inicio)
    return !isNaN(fecha.getTime())
  })

  // {Creo un array con los años y meses que contienen datos, para posteriormente usar este array para filtrar los datos}
  const availableMonths = Array.from(
    new Set(
      empresasValidas.map((item) => {
        const date = parseFechaEuropea(item.fecha_inicio);
        const year = date.getFullYear();
        const month = String(date.getMonth())
        return `${year}-${month}`;
      })
    )
  ).sort().reverse()

  const selectedMonthKey = availableMonths[indiceMes]
  const [year, month] = selectedMonthKey.split("-").map(Number)
  const currentMonthDate = new Date(year, month)
  // {Transformo la fecha a año numerico y mes string para mas visual}
  const monthLabel = currentMonthDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long"
  })
  // {FIltro los datos en la fecha que me indica, es decir los de Diciembre de 2024 ejemplo}
  const datosFiltrados = empresas.filter((item) => {
    const inicio = parseFechaEuropea(item.fecha_inicio)
    return (
      inicio.getMonth() === currentMonthDate.getMonth() &&
      inicio.getFullYear() === currentMonthDate.getFullYear()
    )
  })
  // {Agarro los datos filtrados por y los ordeno por fecha de mas reciente a mas antiguoL}
  const datosFiltradosOrdenados = datosFiltrados.sort((a, b) => {
    const fechaA = new Date(a.fecha_inicio).getTime();
    const fechaB = new Date(b.fecha_inicio).getTime();
    return fechaA - fechaB;
  })
  // {Ahora el ultimo filtro para cuando se tenga que usar la barra de busqueda que me devuelva solo los correspondientes}
  const datosFinales = datosFiltradosOrdenados.filter((empresa) => {
    const texto = busqueda.toLowerCase();
    return (empresa.razon_social.toLowerCase().includes(texto))
  })
  // {Boton para ir al mes anterior}
  const handlePreviousMonth = () => {
    setIndiceMes((prev) => Math.min(prev + 1, availableMonths.length - 1))

    setPaginaActual(0)
  }
  // {Boton para ir al mes posterior}
  const handleNextMonth = () => {
    setIndiceMes((prev) => Math.max(prev - 1, 0))
    setPaginaActual(0)
  }



  return (
    <div className=" flex flex-col w-full px-20">
      {/* {Barra de busqueda con sus respectivos botones} */}
      <div className="flex items-center justify-between w-full">
        <input type="text" placeholder="🔍 Buscar oficina virtual..." className="w-lg h-10 border border-black rounded-lg pl-5 py-5 transition"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(0)
          }
          } />
        <button className="cursor-pointer bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold border-none rounded-full py-3 px-8 shadow-md hover:scale-105 transition-all flex items-center gap-2">
          <MdOutlinePendingActions size={18} />
          Pendientes de pago
        </button>
        <button
          onClick={() => navigate('/inactivos')}
          className="cursor-pointer bg-gradient-to-r from-red-700 to-red-900 text-white font-semibold border-none rounded-full py-3 px-8 shadow-md hover:scale-105 transition-all flex items-center gap-2"
        >
          <TbTimeDurationOff size={18} />
          Inactivos
        </button>
        <button className="cursor-pointer bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold border-none rounded-full py-3 px-8 shadow-md hover:scale-105 transition-all flex items-center gap-2">
          <IoPersonAdd />
          Añadir
        </button>
      </div>
      {/* {Cambio de mes} */}
      <div className=' flex items-center gap-4 text-xl font-medium text-gray-700 my-5 select-none'>
        <FaChevronLeft className="cursor-pointer hover:text-blue-600 transition" onClick={handlePreviousMonth} />
        <span className='w-50 text-center'>{monthLabel.toUpperCase()}</span>
        <FaChevronRight className="cursor-pointer hover:text-blue-600 transition" onClick={handleNextMonth} />
      </div>
      {/* {Componente generico de la tabla pasando los datos de la bbdd} */}
      <div>
        {datosFinales.length === 0 ? (
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
          <TablaOficinas datos={datosFinales} paginaActual={paginaActual} setPaginaActual={setPaginaActual} estado='activo' />
        )}
      </div>
    </div>
  );
}

