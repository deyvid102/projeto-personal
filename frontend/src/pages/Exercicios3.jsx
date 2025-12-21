import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaSearch, FaPlus, FaFilter, FaDumbbell, FaEdit } from "react-icons/fa";
import Alert from "../components/Alert";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/hooks/usePagination";
import { useAlert } from "../components/hooks/useAlert";
import PainelFiltroExercicio from "../components/PainelFiltroExercicio"; // Você precisará criar este similar ao de alunos

export default function Exercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const [filtroGrupo, setFiltroGrupo] = useState("todos");

  const { id: personalId } = useParams();
  const { alert, showAlert } = useAlert(2000);

  // Paginação: 24 exercícios por página (grade 6x4)
  const { currentData, currentPage, totalPages, goToPage, totalItems } = usePagination(exerciciosFiltrados, 24);

  // Grupos musculares para o filtro rápido
  const gruposMusculares = [
    { id: "todos", label: "Todos" },
    { id: "peito", label: "Peito" },
    { id: "costas", label: "Costas" },
    { id: "pernas", label: "Pernas" },
    { id: "ombros", label: "Ombros" },
    { id: "braços", label: "Braços" },
  ];

  useEffect(() => {
    async function carregarExercicios() {
      try {
        const res = await fetch(`http://localhost:3000/exercicios?fk_personal=${personalId}`);
        const data = await res.json();
        // Ordenar de A-Z por padrão
        const ordenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
        setExercicios(ordenados);
        setExerciciosFiltrados(ordenados);
      } catch {
        showAlert("erro ao carregar exercícios", "error");
      } finally {
        setLoading(false);
      }
    }
    carregarExercicios();
  }, [personalId]);

  // Lógica de Busca e Filtro
  useEffect(() => {
    let result = exercicios.filter((ex) =>
      ex.nome.toLowerCase().includes(busca.toLowerCase())
    );

    if (filtroGrupo !== "todos") {
      result = result.filter((ex) => ex.grupo_muscular.toLowerCase() === filtroGrupo);
    }

    setExerciciosFiltrados(result);
  }, [busca, filtroGrupo, exercicios]);

  if (loading) return null;

  return (
    <div className="w-full pb-20 md:ml-20 transition-all duration-300">
      <Alert message={alert.message} type={alert.type} />

      {/* Header */}
      <div className="px-6 md:px-10 mt-6 md:mt-12 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-[1000] text-gray-900 tracking-[-0.05em] uppercase italic leading-none mb-2">
            Biblioteca de <span className="text-blue-600">Exercícios</span>
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600/50"></span>
            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em]">
              {exerciciosFiltrados.length} movimentos cadastrados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
            <input
              type="text"
              placeholder="BUSCAR EXERCÍCIO..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 text-[11px] font-bold w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
            />
          </div>

          <button className="bg-black text-white p-3.5 rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2">
            <FaPlus size={14} />
          </button>
        </div>
      </div>

      {/* Filtros Rápidos (Pills) */}
      <div className="px-6 md:px-10 mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {gruposMusculares.map((grupo) => (
          <button
            key={grupo.id}
            onClick={() => setFiltroGrupo(grupo.id)}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
              filtroGrupo === grupo.id
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
            }`}
          >
            {grupo.label}
          </button>
        ))}
      </div>

      {/* Grid de Exercícios */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-6 md:px-10">
        {currentData.map((ex) => (
          <div
            key={ex._id}
            className="group bg-white border border-gray-100 rounded-2xl p-4 flex flex-col shadow-sm hover:border-blue-600 transition-all cursor-pointer"
          >
            {/* Tag do Grupo Muscular */}
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
                {ex.grupo_muscular}
              </span>
              <FaDumbbell className="text-gray-100 group-hover:text-blue-100 transition-colors" size={20} />
            </div>

            <h3 className="font-[1000] text-gray-900 uppercase tracking-tighter text-[12px] leading-tight mb-1 group-hover:text-blue-600 transition-colors">
              {ex.nome}
            </h3>
            
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight line-clamp-2">
              {ex.equipamento || "Peso Corporal"}
            </p>

            <div className="mt-6 pt-3 border-t border-gray-50 flex items-center justify-between">
               <div className="flex gap-1">
                  <span className="w-4 h-1 bg-blue-600 rounded-full"></span>
                  <span className="w-2 h-1 bg-gray-100 rounded-full"></span>
                  <span className="w-2 h-1 bg-gray-100 rounded-full"></span>
               </div>
               <button className="p-2 text-gray-300 hover:text-black transition-colors">
                  <FaEdit size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="mt-12 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}