import { Outlet, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../common/AuthContext";

export default function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full h-16 shadow flex items-center justify-between px-10">
        <div className="text-gray-800 text-lg font-semibold">
          {user ? `Bienvenido de nuevo, ${user.email!.split("@")[0]}` : "Cargando..."}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer"
        >
          <FiLogOut />
          Logout
        </button>
      </nav>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 px-30 py-5">
        <Outlet />
      </main>
    </div>
  );
}
