import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaDumbbell, FaEdit, FaGlobeAmericas, FaArrowRight, FaTools } from "react-icons/fa";
import Alert from "../components/Alert";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/hooks/usePagination";
import { useAlert } from "../components/hooks/useAlert";
import ModalExercicio from "../components/modals/ModalExercicio";

export default function Exercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercicioParaEditar, setExercicioParaEditar] = useState(null);

  const { personalId } = useParams();
  const navigate = useNavigate();
  
  const { alert, showAlert } = useAlert(2000);
  const { currentData, currentPage, totalPages, goToPage, totalItems } = usePagination(exerciciosFiltrados, 40);

  const gruposMusculares = [
    { id: "todos", label: "todos" },
    { id: "peito", label: "peito" },
    { id: "costas", label: "costas" },
    { id: "pernas", label: "pernas" },
    { id: "ombros", label: "ombros" },
    { id: "braços", label: "braços" },
    { id: "abdômen", label: "abdômen" },
  ];

  async function carregarExercicios() {
    try {
      const res = await fetch(`http://localhost:3000/exercicios?fk_personal=${personalId}`);
      const data = await res.json();
      const ordenados = Array.isArray(data) ? data.sort((a, b) => a.nome.localeCompare(b.nome)) : [];
      setExercicios(ordenados);
      setExerciciosFiltrados(ordenados);
    } catch (err) {
      showAlert("erro ao carregar exercícios", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleSaveExercicio = async (exercicioSalvo) => {
    showAlert(exercicioParaEditar ? "atualizado com sucesso!" : "cadastrado com sucesso!", "success");
    await carregarExercicios();
    setIsModalOpen(false);
    setExercicioParaEditar(null);
  };

  const handleDeletarExercicio = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/exercicios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showAlert("exercício excluído!", "success");
        await carregarExercicios();
        setIsModalOpen(false);
        setExercicioParaEditar(null);
      } else {
        showAlert("erro ao excluir exercício", "error");
      }
    } catch (err) {
      showAlert("erro de conexão ao deletar", "error");
    }
  };

  useEffect(() => {
    carregarExercicios();
  }, [personalId]);

  useEffect(() => {
    let result = exercicios.filter((ex) =>
      ex.nome.toLowerCase().includes(busca.toLowerCase()) ||
      ex.equipamento?.toLowerCase().includes(busca.toLowerCase())
    );

    if (filtroGrupo !== "todos") {
      result = result.filter((ex) => 
        ex.grupoMuscular?.toLowerCase().trim() === filtroGrupo.toLowerCase().trim()
      );
    }

    setExerciciosFiltrados(result);
    goToPage(1);
  }, [busca, filtroGrupo, exercicios]);

  if (loading) return null;

  return (
    <div className="w-full min-h-screen pb-20 md:pl-20 bg-white">
      <Alert message={alert.message} type={alert.type} />

      {isModalOpen && (
        <ModalExercicio
          onClose={() => {
            setIsModalOpen(false);
            setExercicioParaEditar(null);
          }}
          onSave={handleSaveExercicio}
          onDelete={handleDeletarExercicio}
          exercicioParaEditar={exercicioParaEditar}
          bibliotecaExistente={exercicios}
        />
      )}

      <div className="w-full px-4 md:px-0">
        {/* SÓ MOSTRA O CABEÇALHO SE EXISTIR ALGUM EXERCÍCIO OU SE ESTIVER FILTRANDO */}
        {(exercicios.length > 0 || busca || filtroGrupo !== "todos") && (
          <>
            <div className="mt-6 md:mt-12 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-[1000] text-gray-900 tracking-[-0.05em] uppercase italic leading-none">Biblioteca</h1>
                  <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none text-blue-600">Exercícios</h2>
                </div>
                <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em]">{exerciciosFiltrados.length} encontrados</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou equipamento..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="bg-gray-50 border-none rounded-xl py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-[11px] font-bold w-full md:w-72 outline-none"
                  />
                </div>
                
                <button 
                  onClick={() => { 
                    setExercicioParaEditar(null); 
                    setIsModalOpen(true); 
                  }}
                  className="bg-black hover:bg-blue-600 text-white px-4 py-3 md:py-3.5 rounded-xl shadow-lg active:scale-95 transition-all duration-300 flex items-center gap-3 group"
                >
                  <div className="relative">
                    <FaDumbbell size={16} />
                    <div className="absolute -top-1 -right-1.5">
                      <FaPlus size={5} />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-8 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {gruposMusculares.map((grupo) => (
                <button
                  key={grupo.id}
                  onClick={() => setFiltroGrupo(grupo.id)}
                  className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${filtroGrupo === grupo.id ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}
                >
                  {grupo.label}
                </button>
              ))}
            </div>
          </>
        )}

        {exerciciosFiltrados.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
            {currentData.map((ex) => (
              <div
                key={ex._id}
                className={`group bg-white border rounded-2xl p-3.5 flex flex-col shadow-sm transition-all ${ex.publico ? 'border-blue-100/50 bg-blue-50/5' : 'border-gray-100 hover:border-blue-600'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[7px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${ex.publico ? 'bg-blue-100 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                    {ex.grupoMuscular || "Geral"}
                  </span>
                  {ex.publico ? <FaGlobeAmericas className="text-blue-600" size={13} /> : <FaDumbbell className="text-gray-100 group-hover:text-blue-600" size={13} />}
                </div>

                <h3 className="font-black text-gray-900 uppercase tracking-tighter text-[10px] leading-tight mb-1 line-clamp-2">
                  {ex.nome}
                </h3>

                {ex.equipamento && (
                  <div className="flex items-center gap-1.5 mb-4 opacity-60">
                    <FaTools size={8} className="text-gray-400" />
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider truncate">
                      {ex.equipamento}
                    </span>
                  </div>
                )}

                {/* BLOCO DE MÍDIA */}
                <div className="mb-3">
                  {ex.midia?.tipo === "video" ? (
                    <video src={ex.midia.key} controls className="w-full rounded-lg" />
                  ) : ex.midia?.tipo === "imagem" ? (
                    <img src={ex.midia.key} alt={ex.nome} className="w-full rounded-lg object-cover" />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                      <span className="text-gray-400 text-xs">Sem mídia</span>
                    </div>
                  )}
                </div>
                {/* FIM DO BLOCO DE MÍDIA */}

                <div className="mt-auto pt-2.5 border-t border-gray-50 flex items-center justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!ex.publico) {
                        setExercicioParaEditar(ex);
                        setIsModalOpen(true);
                      }
                    }}
                    className={`transition-colors ${ex.publico ? 'text-blue-100 cursor-not-allowed' : 'text-gray-200 hover:text-blue-600'}`}
                  >
                    <FaEdit size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
              <FaDumbbell size={32} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic mb-2 text-center">
              Nenhum exercício <span className="text-blue-600 text-2xl">encontrado</span>
            </h3>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center max-w-xs leading-relaxed mb-8">
              {busca || filtroGrupo !== 'todos' 
                ? "Não encontramos nada com esses filtros. Tente mudar a busca ou grupo muscular." 
                : "Sua biblioteca está vazia. Comece cadastrando seu primeiro movimento para montar seus treinos."}
            </p>
            
            {!busca && filtroGrupo === 'todos' && (
              <button
                onClick={() => {
                  setExercicioParaEditar(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-gray-200"
              >
                Cadastrar Primeiro <FaArrowRight size={10} />
              </button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 mb-10 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} />
          </div>
        )}
      </div>
    </div>
  );
}