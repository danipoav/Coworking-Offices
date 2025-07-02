import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { TbTimeDurationOff } from "react-icons/tb";
import { MdOutlinePendingActions } from "react-icons/md";
import TablaOficinas from '../components/TablaOficinas';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEmpresas, fetchEmpresasInactivas } from '../store/empresasSlice';
import { Empresa } from '../interfaces/Empresa';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from 'react-toastify';

export default function Index() {
  const [indiceMes, setIndiceMes] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { empresas, loading, error, inactivas } = useAppSelector((state) => state.empresas);
  const [mesInicialSeteado, setMesInicialSeteado] = useState(false);

  const ordenModalidad = {
    "My business": 0,
    "Anual": 1,
    "Trimestral": 2,
    "Semestral": 3
  };
  console.log(empresas.map(empresa => empresa.fecha_renovacion))

  useEffect(() => {
    dispatch(fetchEmpresas());
    dispatch(fetchEmpresasInactivas());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && empresas.length > 0) {
      actualizarPendientesDePago(empresas);
    }
  }, [loading, empresas]);

  // Función para parsear fechas en formato europeo 
  const parseFechaEuropea = (fechaStr: string): Date => {
    const [dia, mes, año] = fechaStr.split("-").map(Number);
    return new Date(año, mes - 1, dia);
  };

  const todasLasEmpresas = [...empresas, ...inactivas]

  // Principalmente filtro a las que no estén pendientes de pago
  const noPendingCompanies = empresas.filter((item) => !item.pendiente_pago);

  // Filtra empresas con fechas validas
  const empresasValidas = noPendingCompanies.filter((item) => {
    const fecha = parseFechaEuropea(item.fecha_renovacion);
    return !isNaN(fecha.getTime());
  });

  // Genera lista de meses disponibles a partir de las fechas
  const availableMonths = Array.from(
    new Set(
      empresasValidas.map((item) => {
        const date = parseFechaEuropea(item.fecha_renovacion);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
      })
    )
  ).sort().reverse();

  // Cuando cambian empresas o availableMonths, establecemos el índice en el mes más cercano o actual
  useEffect(() => {
    if (availableMonths.length === 0) return;

    if (mesInicialSeteado) return
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Buscamos el índice del mes actual en availableMonths o el mes más cercano anterior
    let closestIndex = availableMonths.findIndex(mes => mes === currentYearMonth);

    if (closestIndex === -1) {
      // Si no está el mes actual, buscamos el primero que sea menor al mes actual
      closestIndex = availableMonths.findIndex(mes => mes < currentYearMonth);
    }
    if (closestIndex === -1) {
      // Si no encontramos nada, dejamos en 0 
      closestIndex = 0;
    }

    setIndiceMes(closestIndex);
    setPaginaActual(0);
    setMesInicialSeteado(true); // marcamos que ya seteamos

  }, [availableMonths]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[750px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando datos, por favor espera...</p>
        </div>
      </div>
    );
  }

  if (error) return <div className="flex items-center justify-center h-[750px]">
    <div className="text-center">
      <p className="text-red-600 text-lg font-medium">{error}</p>
    </div>
  </div>;

  if (empresas.length === 0) return <div className="flex items-center justify-center h-[750px]">
    <div className="text-center">
      <p className="text-gray-600 text-lg font-medium">No se encontraron empresas</p>
    </div>
  </div>;

  const safeIndiceMes = Math.min(Math.max(indiceMes, 0), availableMonths.length - 1);
  const selectedMonthKey = availableMonths[safeIndiceMes];

  if (!selectedMonthKey) {
    return <div>No hay meses disponibles</div>;
  }

  const [yearStr, monthStr] = selectedMonthKey.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;

  const currentMonthDate = new Date(year, month);

  const monthLabel = currentMonthDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long"
  });

  // Filtramos datos para el mes seleccionado
  const datosFiltrados = noPendingCompanies.filter((item) => {
    const inicio = parseFechaEuropea(item.fecha_renovacion);
    return (
      inicio.getMonth() === currentMonthDate.getMonth() &&
      inicio.getFullYear() === currentMonthDate.getFullYear()
    );
  });

  // Ordenamos por fecha
  const datosFiltradosOrdenados = datosFiltrados.sort((a, b) => {
    const ordenA = ordenModalidad[a.modalidad] ?? 99;  // por si falta el campo o es distinto
    const ordenB = ordenModalidad[b.modalidad] ?? 99;
    return ordenA - ordenB;
  });

  // Si hay búsqueda, filtramos también por texto y ordenamos
  const datosFinales = busqueda.trim()
    ? noPendingCompanies.filter((empresa) =>
      empresa.razon_social.toLowerCase().includes(busqueda.toLowerCase())
    ).sort((a, b) => {
      const fechaA = parseFechaEuropea(a.fecha_renovacion).getTime();
      const fechaB = parseFechaEuropea(b.fecha_renovacion).getTime();
      return fechaA - fechaB;
    })
    : datosFiltradosOrdenados;

  const handlePreviousMonth = () => {
    setIndiceMes((prev) => Math.min(prev + 1, availableMonths.length - 1));
    setPaginaActual(0);
  };

  const handleNextMonth = () => {
    setIndiceMes((prev) => Math.max(prev - 1, 0));
    setPaginaActual(0);
  };

  const actualizarPendientesDePago = async (empresas: Empresa[]) => {
    const hoy = new Date();

    for (const empresa of empresas) {
      const fechaRenovacion = parseFechaEuropea(empresa.fecha_renovacion);

      if (!isNaN(fechaRenovacion.getTime()) && fechaRenovacion < hoy && !empresa.pendiente_pago) {
        const refEmpresa = doc(db, "EmpresaList", empresa.id);

        if (empresa.renovacion === false) {
          try {
            const refBaja = doc(db, "BajasList", empresa.id);
            // Clonamos la empresa en BajasList
            await setDoc(refBaja, empresa);
            // Borramos de EmpresaList
            await deleteDoc(refEmpresa);
            toast.success(`Empresa ${empresa.razon_social} fue pasada a Bajas.`);
          } catch (err) {
            console.error(`Error al mover empresa ${empresa.id} a BajasList`, err);
          }
        } else {
          try {
            await updateDoc(refEmpresa, { pendiente_pago: true });
            toast.success(`Empresa ${empresa.razon_social} marcada como pendiente de pago.`);
          } catch (err) {
            console.error(`Error actualizando empresa ${empresa.id}`, err);
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Barra de búsqueda y botones */}
      <div className="flex items-center justify-between w-full">
        <input
          type="text"
          placeholder="🔍 Buscar oficina virtual..."
          className="w-lg h-10 border border-black rounded-lg pl-5 py-5 transition"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(0);
          }}
        />
        <button
          onClick={() => navigate('/pending')}
          className="cursor-pointer bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold border-none rounded-lg py-3 px-8 shadow-md hover:scale-105 transition-all flex items-center gap-2">
          <MdOutlinePendingActions size={18} />
          Pendientes de pago
        </button>
        <button
          onClick={() => navigate('/inactive')}
          className="cursor-pointer bg-gradient-to-r from-red-700 to-red-900 text-white font-semibold border-none rounded-lg py-3 px-8 shadow-md hover:scale-105 transition-all flex items-center gap-2"
        >
          <TbTimeDurationOff size={18} />
          Inactivos
        </button>
        <button
          onClick={() => navigate('/formSuscribe')}
          className="cursor-pointer bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold border-none rounded-lg py-3 px-8 shadow-md hover:scale-105 transition-all flex items-center gap-2">
          <IoPersonAdd />
          Añadir
        </button>
      </div>

      {/* Selector de mes */}
      <div className="flex items-center justify-center gap-6 text-lg font-semibold text-gray-800 bg-white shadow-sm border border-gray-200 rounded-xl px-6 py-3 my-4 w-[280px] select-none">
        <FaChevronLeft
          className="cursor-pointer text-gray-500 hover:text-blue-600 transition duration-200"
          onClick={handlePreviousMonth}
          size={18}
        />
        <span className="text-center tracking-wide uppercase text-gray-700 w-full text-ellipsis overflow-hidden whitespace-nowrap text-sm">
          {monthLabel}
        </span>
        <FaChevronRight
          className="cursor-pointer text-gray-500 hover:text-blue-600 transition duration-200"
          onClick={handleNextMonth}
          size={18}
        />
      </div>

      {/* Tabla o mensaje vacío */}
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
          <TablaOficinas datos={datosFinales} paginaActual={paginaActual} setPaginaActual={setPaginaActual} estado={datosBusqueda ? 'inactivo' : 'activo'} rutaDetalle='formActive' />
        )}
      </div>
    </div>
  );
}
