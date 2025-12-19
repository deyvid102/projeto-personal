import { NavLink } from "react-router-dom";
import { FaChartBar, FaUserFriends, FaDumbbell, FaRobot, FaSignOutAlt } from "react-icons/fa";

// Importação da logo
import Logo from "../../assets/HP.png";

export default function Sidebar() {
  // estrutura slim: centralizada e compacta
  const linkBase = "group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ease-in-out mb-4 mx-auto";
  const linkActive = "bg-blue-600 text-white shadow-lg shadow-blue-200";
  const linkInactive = "text-gray-400 hover:bg-gray-100 hover:text-blue-600";

  const userId = localStorage.getItem("userId");

  return (
    <aside className="hidden md:flex w-20 bg-white border-r border-gray-100 min-h-screen py-8 flex-col fixed left-0 top-0 z-50">
      
      {/* Logo HQ centralizada */}
      <div className="flex justify-center mb-10 px-4">
        <img 
          src={Logo} 
          alt="HQ Logo" 
          className="w-12 h-auto object-contain" 
        />
      </div>

      <nav className="flex-1 flex flex-col items-center">
        <NavLink
          to={`/${userId}`}
          end
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          <FaChartBar size={18} />
          <span className="absolute left-16 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-widest z-50">
            Dashboard
          </span>
        </NavLink>

        <NavLink
          to={`/${userId}/alunos`}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          <FaUserFriends size={20} />
          <span className="absolute left-16 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-widest z-50">
            Atletas
          </span>
        </NavLink>

        <NavLink
          to={`/${userId}/exercicios`}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          <FaDumbbell size={18} />
          <span className="absolute left-16 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-widest z-50">
            Treinos
          </span>
        </NavLink>

        <NavLink
          to={`/${userId}/ia`}
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
        >
          <FaRobot size={18} />
          <span className="absolute left-16 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-widest z-50">
            IA Coach
          </span>
        </NavLink>
      </nav>

      {/* footer da sidebar com logout */}
      <div className="mt-auto flex flex-col items-center gap-6">
        <button className="text-gray-300 hover:text-red-500 transition-colors p-2">
          <FaSignOutAlt size={18} />
        </button>
      </div>
    </aside>
  );
}