import { Outlet } from "react-router-dom";
import Sidebar from "../components/bars/Sidebar";
import BottomNav from "../components/bars/BottomNav";
import Topbar from "../components/bars/Topbar";

export default function Layout({ onLogout }) {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* sidebar slim (fixa na esquerda no desktop) */}
      <Sidebar onLogout={onLogout} />

      {/* conteúdo principal */}
      <div className="flex-1 flex flex-col md:ml-20 transition-all duration-300">
        
        {/* topbar fixa no topo ou acompanhando o scroll */}
        <div className="hidden md:block sticky top-0 z-40">
          <Topbar onLogout={onLogout}/>
        </div>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* navegação mobile */}
      <div className="md:hidden">
        <BottomNav onLogout={onLogout} />
      </div>
      
    </div>
  );
}