import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaDumbbell, FaEdit, FaGlobeAmericas } from "react-icons/fa";
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
      // busca exercícios vinculados ao personalId da URL
      const res = await fetch(`http://localhost:3000/exercicios?fk_personal=${personalId}`);
      const data = await res.json();
      
      // ordena e salva no estado
      const ordenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
      setExercicios(ordenados);
      setExerciciosFiltrados(ordenados);
    } catch (err) {
      showAlert("erro ao carregar exercícios", "error");
    } finally {
      setLoading(false);
    }
  }

  const handleSaveExercicio = async (dadosForm) => {
    try {
      const isEdicao = !!exercicioParaEditar;
      const url = isEdicao 
        ? `http://localhost:3000/exercicios/${exercicioParaEditar._id}`
        : `http://localhost:3000/exercicios`;

      const response = await fetch(url, {
        method: isEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosForm)
      });

      if (response.ok) {
        showAlert(isEdicao ? "atualizado!" : "cadastrado!", "success");
        await carregarExercicios(); // ESSENCIAL: recarrega a lista do banco
        setIsModalOpen(false);
      } else {
        showAlert("erro ao salvar", "error");
      }
    } catch (err) {
      showAlert("erro de conexão", "error");
    }
  };

  useEffect(() => {
    carregarExercicios();
  }, [personalId]);

  useEffect(() => {
    let result = exercicios.filter((ex) =>
      ex.nome.toLowerCase().includes(busca.toLowerCase())
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
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveExercicio}
          exercicioParaEditar={exercicioParaEditar}
        />
      )}

      <div className="w-full px-4 md:px-0">
        {/* cabeçalho */}
        <div className="mt-6 md:mt-12 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-[1000] text-gray-900 tracking-[-0.05em] uppercase italic leading-none">Biblioteca</h1>
              <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none text-blue-600">Exercícios.</h2>
            </div>
            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em]">{exerciciosFiltrados.length} encontrados</p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
              <input
                type="text"
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="bg-gray-50 border-none rounded-xl py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-[11px] font-bold w-full md:w-64 outline-none"
              />
            </div>
            <button 
              onClick={() => { setExercicioParaEditar(null); setIsModalOpen(true); }}
              className="bg-black text-white p-3 md:p-3.5 rounded-xl shadow-lg active:scale-95 transition-transform"
            >
              <FaPlus size={14} />
            </button>
          </div>
        </div>

        {/* filtros de grupo */}
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

        {/* grid de exercícios */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
          {currentData.map((ex) => (
            <div
              key={ex._id}
              onClick={() => navigate(`/${personalId}/exercicios/${ex._id}`)}
              className={`group bg-white border rounded-2xl p-3.5 flex flex-col shadow-sm transition-all cursor-pointer ${ex.publico ? 'border-blue-100/50 bg-blue-50/5' : 'border-gray-100 hover:border-blue-600'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[7px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${ex.publico ? 'bg-blue-100 text-blue-500' : 'bg-blue-50 text-blue-600'}`}>
                  {ex.grupoMuscular || "Geral"}
                </span>
                {ex.publico ? <FaGlobeAmericas className="text-blue-600" size={13} /> : <FaDumbbell className="text-gray-100 group-hover:text-blue-600" size={13} />}
              </div>
              <h3 className="font-black text-gray-900 uppercase tracking-tighter text-[10px] leading-tight mb-4 line-clamp-2">{ex.nome}</h3>
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

        {totalPages > 1 && (
          <div className="mt-12 mb-10 flex justify-center">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} />
          </div>
        )}
      </div>
    </div>
  );
}