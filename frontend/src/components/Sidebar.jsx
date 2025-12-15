import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const linkBase = "block px-4 py-2 rounded-lg transition";
  const linkActive = "bg-indigo-50 text-indigo-600 font-semibold";

  const userId = localStorage.getItem("userId"); // pega _id do personal logado

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      <h2 className="text-xl font-bold mb-8">AthletIQ</h2>

      <nav className="space-y-2 flex-1">
        {[
          { to: `/${userId}`, label: "Dashboard" },
          { to: `/${userId}/alunos`, label: "Alunos" },
          // { to: `/${userId}/treinos`, label: "Treinos" },
          // { to: `/${userId}/avaliacoes`, label: "Avaliações" },
          // { to: `/${userId}/perfil`, label: "Perfil" },
        ].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? linkActive : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          localStorage.removeItem("userId"); // remove ID ao sair
          navigate("/login");
        }}
        className="text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
      >
        Sair
      </button>
    </aside>
  );
}
