import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const base =
    "flex flex-col items-center text-xs text-gray-600";

  const active =
    "text-indigo-600 font-semibold";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 md:hidden">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${base} ${isActive ? active : ""}`
        }
      >
        <span>🏠</span>
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/alunos"
        className={({ isActive }) =>
          `${base} ${isActive ? active : ""}`
        }
      >
        <span>👥</span>
        <span>Alunos</span>
      </NavLink>

      {/* <NavLink
        to="/treinos"
        className={({ isActive }) =>
          `${base} ${isActive ? active : ""}`
        }
      >
        <span>🏋️</span>
        <span>Treinos</span>
      </NavLink>

      <NavLink
        to="/perfil"
        className={({ isActive }) =>
          `${base} ${isActive ? active : ""}`
        }
      >
        <span>👤</span>
        <span>Perfil</span>
      </NavLink> */}
    </nav>
  );
}
