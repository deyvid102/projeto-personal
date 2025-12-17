import { NavLink } from "react-router-dom";
import { FaHome, FaUserFriends } from "react-icons/fa";

export default function BottomNav({ onLogout }) {
  const base =
    "flex flex-col items-center text-xs text-gray-700 transition-colors duration-200";

  const active ="rounded-lg w-12 bg-gray-900 text-white font-bold";

  const userId = localStorage.getItem("userId");

  return (
    <nav
      className="fixed bottom-4 left-4 right-4 bg-gray-200 bg-opacity-80 rounded-2xl flex justify-around p-2 shadow-lg md:hidden"
    >
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
      
      {/* <NavLink to="/treinos" 
      className={({ isActive }) => ${base} ${isActive ? active : ""} } > 
      <span>🏋️</span> <span>Treinos</span> </NavLink> <NavLink to="/perfil" 
      <span>👤</span> <span>Perfil</span> </NavLink> 
      className={({ isActive }) => ${base} ${isActive ? active : ""} } > 
       */}

    </nav>
  );
}
