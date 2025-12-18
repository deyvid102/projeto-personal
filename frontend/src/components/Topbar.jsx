import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";

export default function Topbar() {
  return (
    <header className="fixed top-0 right-0 md:left-64 left-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 flex items-center justify-between px-6 transition-all duration-300">
      
      {/* Lado Esquerdo: Barra de Pesquisa */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-black transition-colors">
            <FaSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Buscar aluno ou treino..."
            className="w-full bg-gray-50 border border-gray-100 py-3 pl-12 pr-4 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Lado Direito: Notificações e Menu de Perfil */}
      <div className="flex items-center gap-4">
        {/* Ícone de Notificação (Opcional) */}
        <button className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all relative">
          <FaBell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Menu do Usuário */}
        <button className="flex items-center gap-3 pl-2 pr-1 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-gray-900 leading-none uppercase tracking-tighter">Coach HP</p>
            <p className="text-[10px] text-gray-400 font-medium">Personal Trainer</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <FaUserCircle size={24} />
          </div>
        </button>
      </div>
    </header>
  );
}