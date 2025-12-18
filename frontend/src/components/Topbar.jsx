import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUserCircle, FaBell, FaSignOutAlt, FaUserCog, FaChevronDown } from "react-icons/fa";

export default function Topbar({ onLogout }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Executa o logout e fecha o menu
  const executarLogout = () => {
    if (onLogout) {
      onLogout(); // Chama a mesma função que o BottomNav usa
    }
    setMenuAberto(false);
  };

  return (
    <header className="fixed top-0 right-0 md:left-64 left-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 flex items-center justify-between px-6 transition-all duration-300 font-['Oswald']">
      
      {/* Lado Esquerdo: Barra de Pesquisa */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-black transition-colors">
            <FaSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Buscar aluno ou treino..."
            className="w-full bg-gray-50 border border-gray-100 py-3 pl-12 pr-4 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Lado Direito: Notificações e Perfil */}
      <div className="flex items-center gap-4">
        
        <button className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all relative">
          <FaBell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Container do Menu Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl transition-all group border ${
              menuAberto ? 'bg-white border-black shadow-sm' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
            }`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-900 leading-none uppercase tracking-tighter">Coach HP</p>
              <p className="text-[10px] text-gray-400 font-medium">Personal Trainer</p>
            </div>
            
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <FaUserCircle size={22} />
            </div>
            
            <FaChevronDown size={10} className={`text-gray-400 transition-transform duration-300 ${menuAberto ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu Dropdown */}
          {menuAberto && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 animate-slideIn">
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Opções de conta</p>
              </div>

              <Link 
                to="/profile" 
                onClick={() => setMenuAberto(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
              >
                <FaUserCog className="text-gray-400" />
                Meu Perfil
              </Link>

              <div className="h-px bg-gray-50 my-1 mx-4"></div>

              {/* Botão Sair - Agora padronizado */}
              <button 
                onClick={executarLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-red-500 hover:bg-red-50 transition-colors uppercase tracking-wider text-left"
              >
                <FaSignOutAlt />
                Sair do Sistema
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}