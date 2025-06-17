import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import type { Empresa } from '../interfaces/Empresa';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TablaOficinas from '../components/TablaOficinas';


export default function Index() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mesActual, setMesActual] = useState(new Date());
  const [indiceMes, setIndiceMes] = useState(0);

  useEffect(() => {
    console.log('useEffect iniciado');
    async function fetchEmpresas() {
      try {
        console.log('Consultando Firestore...');
        const querySnapshot = await getDocs(collection(db, 'EmpresaList'));
        console.log('querySnapshot obtenido:', querySnapshot);

        const empresasData: Empresa[] = [];
        querySnapshot.forEach(doc => {
          console.log('Doc:', doc.id, doc.data());
          const data = doc.data() as Empresa;
          const { id, ...dataSinId } = data;
          empresasData.push({ id: doc.id, ...dataSinId });
        });
        console.log('Empresas cargadas:', empresasData);
        setEmpresas(empresasData);
      } catch (e) {
        console.error('Error al cargar empresas:', e);
        setError('Error al cargar empresas');
      } finally {
        setLoading(false);
      }
    }
    fetchEmpresas();
  }, []);



  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (empresas.length === 0) return <div>No se encontraron empresas</div>;

  const availableMonths = Array.from(
    new Set(
      empresas.map((item) => {
        const date = new Date(item.fecha_inicio);
        const year = date.getFullYear();
        const month = String(date.getMonth())
        return `${year}-${month}`;
      })
    )
  ).sort()

  const selectedMonthKey = availableMonths[indiceMes]
  const [year, month] = selectedMonthKey.split("-").map(Number)
  const currentMonthDate = new Date(year, month)

  const monthLabel = currentMonthDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long"
  })

  const datosFiltrados = empresas.filter((item) => {
    const inicio = new Date(item.fecha_inicio)
    return (
      inicio.getMonth() === currentMonthDate.getMonth() && inicio.getFullYear() === currentMonthDate.getFullYear()
    )
  })

  const handlePreviousMonth = () => {
    setIndiceMes((prev) => Math.max(prev - 1, 0))
  }

  const handleNextMonth = () => {
    setIndiceMes((prev) => Math.min(prev + 1, availableMonths.length - 1))
  }

  return (
    <div className=" flex flex-col w-full px-20">
      {/* {Barra de busqueda con sus respectivos botones} */}
      <div className="flex items-center justify-between w-full">
        <input type="text" placeholder="🔍 Buscar oficina virtual..." className="w-lg h-10 border border-black rounded-lg pl-5 py-5" />
        <button className=" cursor-pointer bg-gray-600 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-gray-500">Pendientes de pago</button>
        <button className="cursor-pointer bg-red-800 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-red-700">Inactivos</button>
        <button className="cursor-pointer bg-blue-800 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-blue-700">Añadir</button>
      </div>
      {/* {Cambio de mes} */}
      <div className=' flex items-center gap-4 text-xl font-medium text-gray-700 my-5 select-none'>
        <FaChevronLeft className="cursor-pointer hover:text-blue-600 transition" onClick={handlePreviousMonth} />
        <span className='w-50 text-center'>{monthLabel.toUpperCase()}</span>
        <FaChevronRight className="cursor-pointer hover:text-blue-600 transition" onClick={handleNextMonth} />
      </div>
      {/* {Componente generico de la tabla pasando los datos de la bbdd} */}
      <div>
        <TablaOficinas datos={datosFiltrados} />
      </div>
    </div>
  );
}

