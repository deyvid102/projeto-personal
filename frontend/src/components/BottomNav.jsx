import { NavLink } from "react-router-dom";
import { FaHome, FaUserFriends, FaSignOutAlt } from "react-icons/fa";
import SlideIn from "../components/SlideIn";

export default function BottomNav({ onLogout }) {
  const base =
    "flex flex-col items-center text-xs text-gray-700 transition-colors duration-200";

  const active =
    "rounded-lg w-12 bg-gray-900 text-white font-bold";

  const userId = localStorage.getItem("userId");

  return (
    <SlideIn from="bottom">
      <nav className="fixed bottom-4 left-4 right-4 bg-gray-200 bg-opacity-80 rounded-2xl flex justify-around p-2 shadow-lg md:hidden">
        
        <NavLink
          to={`/${userId}/`}
          end
          className={({ isActive }) =>
            `${base} ${isActive ? active : "hover:bg-gray-300"}`
          }
        >
          <FaHome size={28} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to={`/${userId}/alunos`}
          className={({ isActive }) =>
            `${base} ${isActive ? active : "hover:bg-gray-300"}`
          }
        >
          <FaUserFriends size={28} />
          <span>Alunos</span>
        </NavLink>

        <button
          onClick={onLogout}
          className={`${base} hover:bg-red-200 text-red-600`}
        >
          <FaSignOutAlt size={28} />
          <span>Sair</span>
        </button>

      </nav>
    </SlideIn>
  );
}
