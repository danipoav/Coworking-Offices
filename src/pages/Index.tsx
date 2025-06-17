import { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import type { Empresa } from '../interfaces/Empresa';
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";




export default function Index() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (<>

    <div className=" flex flex-col w-full px-20">
      <div className="flex items-center justify-between w-full">
        <input type="text" placeholder="🔍 Buscar oficina virtual..." className="w-lg h-10 border border-black rounded-lg pl-5 py-5" />
        <button className=" cursor-pointer bg-gray-600 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-gray-500">Pendientes de pago</button>
        <button className="cursor-pointer bg-red-800 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-red-700">Inactivos</button>
        <button className="cursor-pointer bg-blue-800 font-semibold text-white border rounded-xl py-3 px-10 hover:bg-blue-700">Añadir</button>
      </div>
      <div className=' flex items-center gap-4 text-xl font-medium text-gray-700 my-10'>
        <FaChevronLeft className="cursor-pointer hover:text-blue-600 transition" />
        <span>Diciembre 2024</span>
        <FaChevronRight className="cursor-pointer hover:text-blue-600 transition" />
      </div>
      <h1>Lista de Empresas</h1>
      <ul>
        {empresas.map(empresa => (
          <li key={empresa.id}>
            <strong>{empresa.razon_social}</strong> - {empresa.email?.join(', ') || 'Sin email'}
          </li>
        ))}
      </ul>
    </div>

  </>);
}

