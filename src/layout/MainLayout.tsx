import { Outlet } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="w-full h-16  shadow flex items-center justify-between px-50">
        <div className="text-gray-800 text-lg font-semibold">
          Bienvenido de nuevo, Jose
        </div>
        <button
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
