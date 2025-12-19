import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ModalAluno from "../components/modals/ModalAluno";
import ModalConfirmacao from "../components/modals/ModalConfirmacao"; 
import PainelFiltro from "../components/PainelFiltro";
import FiltrosAtivos from "../components/FiltrosAtivos";
import Alert from "../components/Alert";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/hooks/usePagination";
import { useAlert } from "../components/hooks/useAlert"; 
import { 
  FaEdit, 
  FaFilter, 
  FaSearch, 
  FaUserPlus 
} from "react-icons/fa";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [nomePersonal, setNomePersonal] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  
  // Mudança para Arrays para suportar multi-seleção
  const [filtrosTemporarios, setFiltrosTemporarios] = useState({ status: [], objetivo: [] });
  const [filtrosAplicados, setFiltrosAplicados] = useState({ status: [], objetivo: [] });
  
  const [busca, setBusca] = useState("");
  const [searchParams] = useSearchParams();
  const { alert, showAlert } = useAlert(2000);
  const { id: personalId } = useParams();
  const navigate = useNavigate();

  const [alunoEditando, setAlunoEditando] = useState(null);
  const [alunoParaDeletar, setAlunoParaDeletar] = useState(null);

  const { currentData, currentPage, totalPages, goToPage, totalItems } = usePagination(alunosFiltrados, 30);

  const formatarObjetivo = (texto) => {
    if (!texto) return "geral";
    const mapa = {
      "manutencao": "manutenção", "emagrecimento": "emagrecimento",
      "hipertrofia": "hipertrofia", "definicao": "definição",
      "saude": "saúde", "reabilitacao": "reabilitação"
    };
    const traduzido = mapa[texto.toLowerCase()] || texto;
    return traduzido.toUpperCase();
  };

  const getStatusLabel = (code) => {
    const labels = { 'A': 'ativo', 'S': 'suspenso', 'C': 'cancelado' };
    return labels[code] || code;
  };

  const ordenarAlunos = (lista) => {
    return [...lista].sort((a, b) => a.nome.localeCompare(b.nome));
  };

  useEffect(() => {
    async function buscarDados() {
      try {
        const resAlunos = await fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`);
        const dataAlunos = await resAlunos.json();
        setAlunos(ordenarAlunos(dataAlunos));

        // NOVA LÓGICA: Captura status da URL e injeta nos arrays de filtro
        const statusUrl = searchParams.get("status");
        if (statusUrl) {
          const filtroInicial = { status: [statusUrl], objetivo: [] };
          setFiltrosAplicados(filtroInicial);
          setFiltrosTemporarios(filtroInicial);
        }

        const idLogado = localStorage.getItem("userId");
        if (idLogado) {
          const resPersonal = await fetch(`http://localhost:3000/personais/${idLogado}`);
          if (resPersonal.ok) {
            const dataPersonal = await resPersonal.json();
            if (dataPersonal && dataPersonal.nome) {
               const partes = dataPersonal.nome.trim().split(/\s+/);
               const formatado = partes.length > 1 ? `${partes[0]} ${partes[1]}` : partes[0];
               setNomePersonal(formatado);
            }
          }
        }
      } catch { 
        showAlert("erro ao carregar dados", "error"); 
      } finally { 
        setLoading(false); 
      }
    }
    buscarDados();
    // Adicionado searchParams como dependência para reagir ao clique no dashboard
  }, [personalId, searchParams]);

  // Lógica de filtragem atualizada para Arrays (Múltipla escolha)
  useEffect(() => {
    let result = alunos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()));
    
    if (filtrosAplicados.status.length > 0) {
      result = result.filter(a => filtrosAplicados.status.includes(a.status));
    }
    
    if (filtrosAplicados.objetivo.length > 0) {
      result = result.filter(a => filtrosAplicados.objetivo.includes(a.objetivo));
    }
    
    setAlunosFiltrados(result);
  }, [busca, filtrosAplicados, alunos]);

  const handleDeletarAluno = async () => {
    if (!alunoParaDeletar) return;
    try {
      const response = await fetch(`http://localhost:3000/alunos/${alunoParaDeletar._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      setAlunos(alunos.filter((a) => a._id !== alunoParaDeletar._id));
      setMostrarConfirmacao(false);
      setAlunoParaDeletar(null);
      showAlert("aluno removido com sucesso", "success");
    } catch {
      showAlert("erro ao excluir aluno", "error");
    }
  };

  const removerFiltro = (campo, valor) => {
    const novosFiltros = { 
      ...filtrosAplicados, 
      [campo]: filtrosAplicados[campo].filter(v => v !== valor) 
    };
    setFiltrosAplicados(novosFiltros);
    setFiltrosTemporarios(novosFiltros); // Sincroniza o painel
  };

  const limparTodosFiltros = () => {
    const reset = { status: [], objetivo: [] };
    setFiltrosAplicados(reset);
    setFiltrosTemporarios(reset);
  };

  const renderStatus = (status) => {
    const configs = {
      'A': { label: 'ativo', color: 'bg-green-500', text: 'text-green-600' },
      'S': { label: 'suspenso', color: 'bg-yellow-500', text: 'text-yellow-600' },
      'C': { label: 'cancelado', color: 'bg-red-500', text: 'text-red-500' }
    };
    const config = configs[status] || configs['C'];
    return (
      <div className="flex items-center gap-1 mb-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${config.color}`}></span>
        <span className={`text-[7px] font-black uppercase tracking-widest ${config.text}`}>{config.label}</span>
      </div>
    );
  };

  const hasFiltros = filtrosAplicados.status.length > 0 || filtrosAplicados.objetivo.length > 0;

  if (loading) return null;

  const partesNome = nomePersonal.split(" ");
  const primeiroNome = partesNome[0];
  const restoNome = partesNome.slice(1).join(" ");

  return (
    <div className="w-full pb-20">
      <Alert message={alert.message} type={alert.type} />

      {/* header */}
      <div className="px-4 md:px-0 mt-6 md:mt-12 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-1">
            {primeiroNome} <span className="text-blue-600">{restoNome}</span>
          </h1>
          <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest">
            {alunosFiltrados.length} alunos encontrados
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
            <input 
              type="text"
              placeholder="buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-gray-50 border-none rounded-xl py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-[11px] font-bold w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
            />
          </div>

          {/* Botão de Filtro Dinâmico */}
          <button 
            onClick={() => setMostrarPainel(true)} 
            className={`p-3 md:p-3.5 rounded-xl transition-all flex items-center gap-2 ${
              hasFiltros 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                : "bg-gray-50 text-gray-400 active:bg-gray-100"
            }`}
          >
            <FaFilter size={14} />
            {hasFiltros && (
              <span className="text-[10px] font-black uppercase hidden"></span>
            )}
          </button>

          <button 
            onClick={() => { setAlunoEditando(null); setMostrarModal(true); }} 
            className="bg-black text-white p-3 md:p-3.5 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center"
          >
            <FaUserPlus size={16} />
          </button>
        </div>
      </div>

      {/* Etiquetas que só aparecem quando aplicadas */}
      <FiltrosAtivos 
        filtros={filtrosAplicados} 
        removerFiltro={removerFiltro} 
        limparTodos={limparTodosFiltros}
        formatarObjetivo={formatarObjetivo}
        getStatusLabel={getStatusLabel}
      />

      {/* grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 px-4 md:px-0">
        {currentData.map((aluno) => (
          <div 
            key={aluno._id}
            onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
            className={`bg-white border border-gray-100 rounded-2xl p-3.5 flex flex-col shadow-sm active:border-blue-600 md:hover:border-blue-600 transition-all cursor-pointer ${aluno.status === 'C' ? 'opacity-50 grayscale' : ''}`}
          >
            {renderStatus(aluno.status)}
            <h3 className="font-black text-gray-900 uppercase tracking-tighter text-[10px] leading-tight mb-0.5 truncate">{aluno.nome}</h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase mb-3">{aluno.idade ? `${aluno.idade} anos` : "-- anos"}</span>
            <div className="mt-auto pt-2.5 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[7px] font-black text-blue-600/60 uppercase tracking-widest leading-none">{formatarObjetivo(aluno.objetivo)}</span>
              <button onClick={(e) => { e.stopPropagation(); setAlunoEditando(aluno); setMostrarModal(true); }} className="text-gray-200 active:text-blue-600 md:hover:text-blue-600 transition-colors">
                <FaEdit size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} />
      </div>

      {/* Modals e Painel */}
      {mostrarModal && (
        <ModalAluno
          aluno={alunoEditando}
          showAlert={showAlert}
          onClose={() => { setMostrarModal(false); setAlunoEditando(null); }}
          onSave={(alunoSalvo) => {
            const novaLista = alunoEditando ? alunos.map((a) => (a._id === alunoSalvo._id ? alunoSalvo : a)) : [...alunos, alunoSalvo];
            setAlunos(ordenarAlunos(novaLista));
            setMostrarModal(false);
          }}
          onDelete={(aluno) => {
            setAlunoParaDeletar(aluno);
            setMostrarConfirmacao(true);
            setMostrarModal(false);
          }}
        />
      )}

      {mostrarConfirmacao && (
        <ModalConfirmacao
          isOpen={mostrarConfirmacao}
          onClose={() => setMostrarConfirmacao(false)}
          onConfirm={handleDeletarAluno}
          title="Excluir Aluno"
          message={`Tem certeza que deseja excluir o aluno ${alunoParaDeletar?.nome}?`}
        />
      )}
      
      <PainelFiltro 
        isOpen={mostrarPainel} 
        onClose={() => setMostrarPainel(false)} 
        onApply={(f) => {
          setFiltrosAplicados(f); // Aplica e mostra as etiquetas
          setMostrarPainel(false);
        }} 
        filters={filtrosTemporarios} 
        setFilters={setFiltrosTemporarios} 
      />
    </div>
  );
}