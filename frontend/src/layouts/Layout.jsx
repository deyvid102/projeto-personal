import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import Topbar from "../components/Topbar"; // Importe a Topbar aqui

export default function Layout({ onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      <Sidebar onLogout={onLogout} />

      {/* CONTEÚDO PRINCIPAL COM TOPBAR */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        
        {/* Topbar visível apenas no Desktop (ou se desejar no mobile também) */}
        <div className="hidden md:block">
          <Topbar />
        </div>

        {/* Espaçamento superior 'mt-20' para a Topbar no Desktop */}
        <main className="flex-1 p-4 md:p-8 md:mt-20 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="md:hidden">
        <BottomNav onLogout={onLogout} />
      </div>
      
    </div>
  );
}