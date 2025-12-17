import { NavLink } from "react-router-dom";
import logo from "../images/logo-hpathlet.png";

export default function Sidebar({ onLogout }) {
  const linkBase = "block px-4 py-2 rounded-lg transition";
  const linkActive = "bg-gray-900 text-gray-50 font-semibold";

  const userId = localStorage.getItem("userId");

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      
     {/* 
      <NavLink
          to={`/${userId}`}
          end
        >
           LOGO 
                <a className="box-content h-32 w-32 ...">
                  <img
                    src={logo}
                    className=""
                  />
                </a>
        </NavLink>
*/}
      <nav className="space-y-2 flex-1">
        <NavLink
          to={`/${userId}`}
          end
          className={({ isActive }) =>
            `${linkBase} ${
              isActive ? linkActive : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to={`/${userId}/alunos`}
          className={({ isActive }) =>
            `${linkBase} ${
              isActive ? linkActive : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Alunos
        </NavLink>
      </nav>

      <button
        onClick={onLogout}
        className="text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
      >
        Sair
      </button>
    </aside>
  );
}
