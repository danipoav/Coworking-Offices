import { Outlet, useNavigate } from "react-router-dom";
import { FiLogOut, FiDownload } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../common/AuthContext";
import { toast } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión:" + error);
    }
  };

  const toCSV = (data: any[], headers: string[]): string => {
    const rows = data.map(obj =>
      headers.map(key => {
        const value = obj[key];
        if (Array.isArray(value)) {
          return `"${value.join(", ")}"`; // CSV-safe array
        } else if (typeof value === "object" && value !== null) {
          return `"${JSON.stringify(value)}"`; // JSON string
        } else {
          return `"${value ?? ""}"`;
        }
      }).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };


  const handleBackup = async () => {
    try {
      console.log("Iniciando backup...");

      // Función para formatear campos de arrays como strings
      const formatEmpresaData = (data: any[]) => {
        return data.map(empresa => ({
          ...empresa,
          telefono_contacto: Array.isArray(empresa.telefono_contacto)
            ? empresa.telefono_contacto.join(" ")
            : empresa.telefono_contacto || "",
          email: Array.isArray(empresa.email)
            ? empresa.email.join(" ")
            : empresa.email || ""
        }));
      };

      // Obtener datos de EmpresaList
      const activosSnap = await getDocs(collection(db, "EmpresaList"));
      const activos = formatEmpresaData(activosSnap.docs.map(doc => doc.data()));

      // Obtener datos de BajasList
      const inactivosSnap = await getDocs(collection(db, "BajasList"));
      const inactivos = formatEmpresaData(inactivosSnap.docs.map(doc => doc.data()));

      // Obtener datos de HistoricoList
      const historicoSnap = await getDocs(collection(db, "HistoricoList"));
      const historicoData: any[] = [];

      historicoSnap.forEach(doc => {
        const data = doc.data();
        const empresaId = data.empresaId;
        if (Array.isArray(data.historial)) {
          data.historial.forEach(entry => {
            historicoData.push({
              empresaId,
              cambios: typeof entry.cambios === "object"
                ? JSON.stringify(entry.cambios)
                : entry.cambios,
              fecha: entry.fecha,
              usuario: entry.usuario
            });
          });
        }
      });

      // Crear libro Excel
      const wb = XLSX.utils.book_new();

      // Agregar hoja de Empresas Activas
      const wsActivos = XLSX.utils.json_to_sheet(activos);
      XLSX.utils.book_append_sheet(wb, wsActivos, "Empresas Activas");

      // Agregar hoja de Empresas Inactivas
      const wsInactivos = XLSX.utils.json_to_sheet(inactivos);
      XLSX.utils.book_append_sheet(wb, wsInactivos, "Empresas Inactivas");

      // Agregar hoja de Histórico
      const wsHistorico = XLSX.utils.json_to_sheet(historicoData);
      XLSX.utils.book_append_sheet(wb, wsHistorico, "Historico");

      // Exportar archivo
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      saveAs(blob, "backup_oficinas.xlsx");
      console.log("Backup generado con éxito.");
    } catch (error) {
      console.error("Error generando backup:", error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full h-16 shadow flex items-center justify-between px-10">
        <div className="text-gray-800 text-lg font-semibold">
          {user ? `Bienvenido de nuevo, ${user.email!.split("@")[0]}` : "Cargando..."}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackup}
            className="flex items-center gap-2 bg-green-200 text-green-800 px-4 py-2 rounded-lg hover:bg-green-300 transition cursor-pointer"
          >
            <FiDownload />
            Backup
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 px-30 py-5">
        <Outlet />
      </main>
    </div>
  );
}
