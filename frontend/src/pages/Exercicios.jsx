import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaSearch, FaPlus, FaDumbbell, FaEdit, FaGlobeAmericas } from "react-icons/fa";
import Alert from "../components/Alert";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/hooks/usePagination";
import { useAlert } from "../components/hooks/useAlert";
// Importação do Modal
import ModalExercicio from "../components/modals/ModalExercicio";

export default function Exercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("todos");

  // Estados para controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercicioParaEditar, setExercicioParaEditar] = useState(null);

  const { personalId } = useParams();
  const { alert, showAlert } = useAlert(2000);

  const { currentData, currentPage, totalPages, goToPage, totalItems } = usePagination(exerciciosFiltrados, 40);

  const gruposMusculares = [
    { id: "todos", label: "todos" },
    { id: "peito", label: "peito" },
    { id: "costas", label: "costas" },
    { id: "pernas", label: "pernas" },
    { id: "ombros", label: "ombros" },
    { id: "bracos", label: "braços" },
  ];

  async function carregarExercicios() {
    try {
      const res = await fetch(`http://localhost:3000/exercicios?fk_personal=${personalId}`);
      const data = await res.json();
      const ordenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
      setExercicios(ordenados);
      setExerciciosFiltrados(ordenados);
    } catch (err) {
      showAlert("erro ao carregar exercícios", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarExercicios();
  }, [personalId]);

  useEffect(() => {
    let result = exercicios.filter((ex) =>
      ex.nome.toLowerCase().includes(busca.toLowerCase())
    );

    if (filtroGrupo !== "todos") {
      result = result.filter((ex) => {
        const grupoBanco = ex.grupoMuscular?.toLowerCase().trim();
        const grupoFiltro = filtroGrupo.toLowerCase().trim();
        return grupoBanco === grupoFiltro;
      });
    }

    setExerciciosFiltrados(result);
    goToPage(1);
  }, [busca, filtroGrupo, exercicios]);

  if (loading) return null;

  return (
    <div className="w-full min-h-screen pb-20 md:pl-20 transition-all duration-300 bg-white">
      <Alert message={alert.message} type={alert.type} />

      {/* Renderização Condicional do Modal */}
      {isModalOpen && (
        <ModalExercicio
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          exercicio={exercicioParaEditar}
          onSuccess={() => {
            carregarExercicios();
            setIsModalOpen(false);
          }}
        />
      )}

      <div className="w-full px-4 md:px-0">
        
        <div className="mt-6 md:mt-12 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-[1000] text-gray-900 tracking-[-0.05em] uppercase italic leading-none">
                Biblioteca
              </h1>
              <div className="h-6 w-[2px] bg-gray-200 rotate-[20deg] hidden sm:block"></div>
              <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none text-blue-600">
                Exercícios.
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600/50"></span>
              <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em]">
                {exerciciosFiltrados.length} movimentos encontrados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
              <input
                type="text"
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="bg-gray-50 border-none rounded-xl py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-[11px] font-bold w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
              />
            </div>
            {/* Botão Adicionar redirecionando para Modal */}
            <button 
              onClick={() => {
                setExercicioParaEditar(null);
                setIsModalOpen(true);
              }}
              className="bg-black text-white p-3 md:p-3.5 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center shrink-0"
            >
              <FaPlus size={14} />
            </button>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {gruposMusculares.map((grupo) => (
            <button
              key={grupo.id}
              onClick={() => setFiltroGrupo(grupo.id)}
              className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                filtroGrupo === grupo.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
              }`}
            >
              {grupo.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 3xl:grid-cols-12 gap-2.5">
          {currentData.length > 0 ? (
            currentData.map((ex) => (
              <div
                key={ex._id}
                className={`group bg-white border rounded-2xl p-3.5 flex flex-col shadow-sm active:border-blue-600 md:hover:border-blue-600 transition-all cursor-pointer ${ex.publico ? 'border-blue-100/50 bg-blue-50/5' : 'border-gray-100'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[7px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${ex.publico ? 'bg-blue-100 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                    {ex.grupoMuscular || "Geral"}
                  </span>
                  
                  {ex.publico ? (
                    <FaGlobeAmericas title="Exercício Global" className="text-blue-600 opacity-40 group-hover:opacity-100 transition-opacity" size={13} />
                  ) : (
                    <FaDumbbell className="text-gray-100 group-hover:text-blue-600 transition-colors" size={13} />
                  )}
                </div>

                <h3 className="font-black text-gray-900 uppercase tracking-tighter text-[10px] leading-tight mb-0.5 line-clamp-2 min-h-[24px]">
                  {ex.nome}
                </h3>
                
                <p className="text-[9px] font-bold text-gray-400 uppercase truncate">
                  {ex.equipamento || "Peso Corporal"}
                </p>

                <div className="mt-auto pt-2.5 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex gap-1">
                    <span className={`w-3 h-1 rounded-full ${ex.publico ? 'bg-blue-400' : 'bg-gray-100'}`}></span>
                    <span className="w-1 h-1 bg-gray-100 rounded-full"></span>
                  </div>
                  {/* Botão Editar redirecionando para Modal */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExercicioParaEditar(ex);
                      setIsModalOpen(true);
                    }}
                    className={`transition-colors ${ex.publico ? 'text-blue-100 cursor-not-allowed' : 'text-gray-200 active:text-blue-600 md:hover:text-blue-600'}`}
                  >
                    <FaEdit size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">nenhum exercício encontrado</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 mb-10 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              totalItems={totalItems}
            />
          </div>
        )}
      </div>
    </div>
  );
}