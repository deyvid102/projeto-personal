import { NavLink } from "react-router-dom";
import { FaHome, FaUserFriends, FaSignOutAlt } from "react-icons/fa";
import SlideIn from "../SlideIn";

export default function BottomNav({ onLogout }) {
  // Estilo base: itens ocupam o mesmo espaço e centralizam conteúdo
  const base = "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all duration-300 relative z-10";
  
  const active = "text-gray-900 scale-110"; 
  const inactive = "text-gray-500 hover:text-gray-800";

  const userId = localStorage.getItem("userId");

  return (
    /* O SlideIn precisa envolver o container fixo sem anular o posicionamento */
    <div className="fixed bottom-6 left-0 right-0 px-6 z-[100] md:hidden">
      <SlideIn from="bottom">
        <nav className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl flex justify-around p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          
          <NavLink
            to={`/${userId}/`}
            end
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            {({ isActive }) => (
              <>
                <FaHome size={22} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-gray-900 rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to={`/${userId}/alunos`}
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            {({ isActive }) => (
              <>
                <FaUserFriends size={22} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Alunos</span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-gray-900 rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <button
            onClick={onLogout}
            className={`${base} text-red-500 active:scale-90`}
          >
            <FaSignOutAlt size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Sair</span>
          </button>

        </nav>
      </SlideIn>
    </div>
  );
}