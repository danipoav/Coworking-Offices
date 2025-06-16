import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';
import type { Empresa } from '../interfaces/Empresa';

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

  return (
    <div>
      <h1>Lista de Empresas</h1>
      <ul>
        {empresas.map(empresa => (
          <li key={empresa.id}>
            <strong>{empresa.razon_social}</strong> - {empresa.email?.join(', ') || 'Sin email'}
          </li>
        ))}
      </ul>
    </div>
  );
}