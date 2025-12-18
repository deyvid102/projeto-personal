import { NavLink } from "react-router-dom";
import { FaChartBar, FaUserFriends } from "react-icons/fa";

export default function Sidebar() {
  const linkBase = "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out mb-2";
  const linkActive = "bg-black text-white shadow-lg shadow-gray-200 font-bold scale-[1.02]";
  const linkInactive = "text-gray-600 hover:bg-gray-200 hover:text-gray-900";

  const userId = localStorage.getItem("userId");

  return (
    <aside className="hidden md:flex w-64 bg-gray-200 border-r border-gray-100 min-h-screen p-6 flex-col fixed left-0 top-0 z-50">
      
      <div className="mt-4 flex-1">
        <nav className="space-y-2">
          <NavLink
            to={`/${userId}`}
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <FaChartBar size={18} className="transition-transform group-hover:rotate-3" />
            <span className="tracking-wide">Dashboard</span>
          </NavLink>

          <NavLink
            to={`/${userId}/alunos`}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <FaUserFriends size={20} className="transition-transform group-hover:rotate-3" />
            <span className="tracking-wide">Alunos</span>
          </NavLink>
        </nav>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <p className="text-[10px] text-gray-500 text-center tracking-tighter uppercase font-bold">
          HP Athlete v1.0
        </p>
      </div>
    </aside>
  );
}