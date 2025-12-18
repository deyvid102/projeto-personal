import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalAluno from "../components/modals/ModalAluno";
import ModalConfirmacao from "../components/modals/ModalConfirmacao"; 
import PainelFiltro from "../components/PainelFiltro"; // Importação do novo painel
import StatusDot from "../components/StatusDot";
import Alert from "../components/Alert";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/hooks/usePagination";
import { useAlert } from "../components/hooks/useAlert"; 
import { FaEdit, FaTrash, FaUserPlus, FaFilter } from "react-icons/fa";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPainel, setMostrarPainel] = useState(false); // Estado para o painel lateral
  const [filtrosAtivos, setFiltrosAtivos] = useState({ status: "", objetivo: "" });
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [alunoParaCancelar, setAlunoParaCancelar] = useState(null);
  const [alunoParaDeletarPermanente, setAlunoParaDeletarPermanente] = useState(null);

  const { alert, showAlert } = useAlert(2000);
  const { id: personalId } = useParams();
  const navigate = useNavigate();

  const { currentData, currentPage, totalPages, goToPage, totalItems } = usePagination(alunosFiltrados, 8);

  const formatarObjetivo = (texto) => {
    if (!texto) return "geral";
    const mapa = {
      "manutencao": "manutenção",
      "emagrecimento": "emagrecimento",
      "hipertrofia": "hipertrofia",
      "definicao": "definição",
      "saude": "saúde",
      "reabilitacao": "reabilitação"
    };
    return mapa[texto.toLowerCase()] || texto;
  };

  const ordenarAlunos = (lista) => {
    return [...lista].sort((a, b) => {
      const pesoStatus = { A: 1, S: 2, C: 3 };
      const statusA = pesoStatus[a.status] || 4;
      const statusB = pesoStatus[b.status] || 4;
      if (statusA !== statusB) return statusA - statusB;
      return a.nome.localeCompare(b.nome);
    });
  };

  useEffect(() => {
  async function buscarAlunos() {
    try {
      const response = await fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`);
      const data = await response.json();
      const ordenada = ordenarAlunos(data);
      
      setAlunos(ordenada);           // fonte da verdade
      setAlunosFiltrados(ordenada);  // o que aparece na tela
    } catch {
      showAlert("erro ao carregar", "error");
    } finally { setLoading(false); }
  }
  buscarAlunos();
}, [personalId]);

  const aplicarFiltros = (novosFiltros) => {
  // sempre partimos da lista original 'alunos'
  let resultado = [...alunos];

  // filtro de status (comparação exata: "A", "S" ou "C")
  if (novosFiltros.status) {
    resultado = resultado.filter(aluno => 
      aluno.status === novosFiltros.status
    );
  }

  // filtro de objetivo (limpeza de strings para evitar erros de case)
  if (novosFiltros.objetivo) {
    resultado = resultado.filter(aluno => {
      if (!aluno.objetivo) return false;
      
      const objAluno = aluno.objetivo.trim().toLowerCase();
      const objFiltro = novosFiltros.objetivo.trim().toLowerCase();
      
      return objAluno === objFiltro;
    });
  }

  setAlunosFiltrados(resultado);
  setFiltrosAtivos(novosFiltros); // mantém o estado visual dos selects
  setMostrarPainel(false);
  goToPage(1); // essencial: volta para a página 1 se houver paginação
};

  async function confirmarCancelamento() {
    if (!alunoParaCancelar) return;
    try {
      const response = await fetch(`http://localhost:3000/alunos/${alunoParaCancelar._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...alunoParaCancelar, status: "C" }),
      });
      if (!response.ok) throw new Error();
      const alunoAtualizado = await response.json();
      
      const novaLista = alunos.map((a) => (a._id === alunoAtualizado._id ? alunoAtualizado : a));
      setAlunos(ordenarAlunos(novaLista));
      setAlunosFiltrados(ordenarAlunos(novaLista));
      showAlert("matrícula cancelada", "warning");
    } catch {
      showAlert("erro ao cancelar", "error");
    } finally {
      setAlunoParaCancelar(null);
    }
  }

  async function deletarAlunoPermanente() {
    if (!alunoParaDeletarPermanente) return;
    try {
      const response = await fetch(`http://localhost:3000/alunos/${alunoParaDeletarPermanente._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      const novaLista = alunos.filter((a) => a._id !== alunoParaDeletarPermanente._id);
      setAlunos(novaLista);
      setAlunosFiltrados(novaLista);
      showAlert("aluno removido com sucesso", "success");
    } catch {
      showAlert("erro ao eliminar dados", "error");
    } finally {
      setAlunoParaDeletarPermanente(null);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[100]">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <Alert message={alert.message} type={alert.type} />

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Alunos</h1>
          <p className="text-gray-400 text-sm font-medium tracking-tight">gerencie sua base de alunos</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setMostrarPainel(true)}
            className={`p-3.5 rounded-2xl border transition-all flex items-center gap-2 font-bold text-xs ${
              filtrosAtivos.status || filtrosAtivos.objetivo 
                ? "bg-black text-white border-black" 
                : "bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black"
            }`}
          >
            <FaFilter size={14} />
            <span className="hidden uppercase"/>
          </button>

          <button
            onClick={() => { setAlunoEditando(null); setMostrarModal(true); }}
            className="bg-black text-white px-3 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            <FaUserPlus size={20} />
          </button>
        </div>
      </div>

      {alunosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 px-6 text-center">
          <p className="text-gray-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">nenhum aluno encontrado para os critérios</p>
          <button
            onClick={() => { 
              setFiltrosAtivos({status: "", objetivo: ""});
              setAlunosFiltrados(alunos);
            }}
            className="text-black font-black text-xs underline uppercase tracking-widest"
          >
            limpar filtros aplicados
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentData.map((aluno) => (
  <div
    key={aluno._id}
    onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
    className={`relative p-8 rounded-[32px] border transition-all duration-300 flex flex-col justify-between min-h-[160px] cursor-pointer group
      ${aluno.status === 'C' 
        ? 'bg-gray-50 border-gray-100 opacity-60' 
        : 'bg-white border-gray-100 hover:border-black hover:shadow-2xl hover:-translate-y-1'}
    `}
  >
    <div className="pr-16">
      <h3 className={`font-black text-2xl truncate tracking-tighter ${aluno.status === 'C' ? 'text-gray-400' : 'text-gray-900'}`}>
        {aluno.nome}{aluno.idade ? `, ${aluno.idade}` : ""}
      </h3>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">objetivo:</span>
        <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-tight">
          {formatarObjetivo(aluno.objetivo)}
        </span>
      </div>
    </div>

    {/* botões de ação que reaparecem no hover */}
    <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          setAlunoEditando(aluno); 
          setMostrarModal(true); 
        }}
        className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-black hover:border-black transition-all"
      >
        <FaEdit size={14} />
      </button>

      {aluno.status !== "C" && (
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            setAlunoParaCancelar(aluno); 
          }}
          className="p-3 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-600 transition-all"
        >
          <FaTrash size={14} />
        </button>
      )}
    </div>

    <div className="mt-8 flex justify-between items-center border-t border-gray-50 pt-4">
      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">id: {aluno._id.slice(-5)}</span>
      <StatusDot status={aluno.status} />
    </div>
  </div>
))}
          </div>

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalItems}
          />
        </>
      )}

      {mostrarModal && (
        <ModalAluno
          aluno={alunoEditando}
          showAlert={showAlert}
          onClose={() => { setMostrarModal(false); setAlunoEditando(null); }}
          onDelete={(aluno) => setAlunoParaDeletarPermanente(aluno)}
          onSave={(alunoSalvo) => {
            const novaLista = alunoEditando 
              ? alunos.map((a) => (a._id === alunoSalvo._id ? alunoSalvo : a)) 
              : [...alunos, alunoSalvo];
            const ordenada = ordenarAlunos(novaLista);
            setAlunos(ordenada);
            setAlunosFiltrados(ordenada);
            setMostrarModal(false);
          }}
        />
      )}

      {/* PAINEL LATERAL DE FILTROS */}
      <PainelFiltro 
        isOpen={mostrarPainel}
        onClose={() => setMostrarPainel(false)}
        onApply={aplicarFiltros}
        filters={filtrosAtivos}
        setFilters={setFiltrosAtivos}
        options={{
          objetivos: ["Emagrecimento", "Hipertrofia", "Definição", "Saúde", "Reabilitação", "Manutenção"]
        }}
      />

      <ModalConfirmacao
        isOpen={Boolean(alunoParaCancelar)}
        onClose={() => setAlunoParaCancelar(null)}
        onConfirm={confirmarCancelamento}
        title="cancelar aluno?"
        message={`a matrícula de ${alunoParaCancelar?.nome} será marcada como inativa.`}
      />

      <ModalConfirmacao
        isOpen={Boolean(alunoParaDeletarPermanente)}
        onClose={() => setAlunoParaDeletarPermanente(null)}
        onConfirm={deletarAlunoPermanente}
        isCritical={true}
        title="eliminar definitivo?"
        message={`tem certeza que deseja apagar todos os dados de ${alunoParaDeletarPermanente?.nome}?`}
      />
    </div>
  );
}