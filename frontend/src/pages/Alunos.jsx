import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// --- componentes de interface ---
import ModalAluno from "../components/modals/ModalAluno";
import ModalConfirmacao from "../components/modals/ModalConfirmacao"; 
import PainelFiltro from "../components/PainelFiltro";
import FiltrosAtivos from "../components/FiltrosAtivos";
import Alert from "../components/Alert";
import Pagination from "../components/Pagination";

// --- hooks customizados ---
import { usePagination } from "../components/hooks/usePagination";
import { useAlert } from "../components/hooks/useAlert"; 

// --- ícones ---
import { FaEdit, FaFilter, FaSearch, FaUserPlus } from "react-icons/fa";

export default function Alunos() {
  // =========================================================
  // estados de dados e interface
  // =========================================================
  const [alunos, setAlunos] = useState([]);                 // dados brutos vindos da api
  const [alunosFiltrados, setAlunosFiltrados] = useState([]); // dados após busca e filtros
  const [nomePersonal, setNomePersonal] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  // =========================================================
  // estados de controle de modais/painéis
  // =========================================================
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [alunoParaDeletar, setAlunoParaDeletar] = useState(null);

  // =========================================================
  // lógica de filtros e ordenação
  // =========================================================
  const [filtrosTemporarios, setFiltrosTemporarios] = useState({ 
    status: [], objetivo: [], idade: { min: "", max: "" }, ordem: "nome"
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({ 
    status: [], objetivo: [], idade: { min: "", max: "" }, ordem: "nome"
  });

  // =========================================================
  // hooks de navegação e utilitários
  // =========================================================
  const { personalId } = useParams(); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { alert, showAlert } = useAlert(2000);
  
  // hook de paginação: gerencia a quebra da lista em páginas de 30 itens
  const { currentData, currentPage, totalPages, goToPage, totalItems } = usePagination(alunosFiltrados, 30);

  // =========================================================
  // funções de formatação e auxílio
  // =========================================================
  
  /**
   * converte o slug do banco para um nome legível na etiqueta do card.
   * agora inclui a lógica de "outro" para objetivos customizados.
   */
  const formatarObjetivo = (texto) => {
    if (!texto) return "GERAL";
    const mapa = {
      "manutencao": "manutenção", "emagrecimento": "emagrecimento",
      "hipertrofia": "hipertrofia", "definicao": "definição",
      "saude": "saúde", "reabilitacao": "reabilitação",
      "outro": "outro"
    };
    const traduzido = mapa[texto.toLowerCase()] || texto;
    return traduzido.toUpperCase();
  };

  const getStatusLabel = (code) => {
    const labels = { 'A': 'ativo', 'S': 'suspenso', 'C': 'cancelado' };
    return labels[code] || code;
  };

  const aplicarOrdenacao = (lista, criterio) => {
    const novaLista = [...lista];
    if (criterio === "nome") return novaLista.sort((a, b) => a.nome.localeCompare(b.nome));
    if (criterio === "recente") return novaLista.sort((a, b) => b._id.localeCompare(a._id));
    return novaLista;
  };

  // =========================================================
  // efeitos (side effects)
  // =========================================================

  // busca inicial: carrega alunos e dados do personal
  useEffect(() => {
    async function buscarDados() {
      try {
        const resAlunos = await fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`);
        const dataAlunos = await resAlunos.json();
        setAlunos(aplicarOrdenacao(dataAlunos, "nome"));

        // verifica se há filtros vindo diretamente pela url (ex: dashboard)
        const statusUrl = searchParams.get("status");
        if (statusUrl) {
          const filtroInicial = { status: [statusUrl], objetivo: [], idade: { min: "", max: "" }, ordem: "nome" };
          setFiltrosAplicados(filtroInicial);
          setFiltrosTemporarios(filtroInicial);
        }

        // carrega nome formatado do personal logado
        const idLogado = localStorage.getItem("userId");
        if (idLogado) {
          const resPersonal = await fetch(`http://localhost:3000/personais/${idLogado}`);
          if (resPersonal.ok) {
            const data = await resPersonal.json();
            if (data?.nome) {
               const partes = data.nome.trim().split(/\s+/);
               setNomePersonal(partes.length > 1 ? `${partes[0]} ${partes[1]}` : partes[0]);
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
  }, [personalId, searchParams]);

  // motor de filtragem: roda sempre que a busca, filtros ou lista base mudarem
  useEffect(() => {
    let result = alunos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()));
    
    if (filtrosAplicados.status.length > 0) {
      result = result.filter(a => filtrosAplicados.status.includes(a.status));
    }
    
    if (filtrosAplicados.objetivo.length > 0) {
      const padroes = ['emagrecimento', 'definicao', 'hipertrofia'];
      result = result.filter(a => {
        const objAluno = a.objetivo?.toLowerCase();
        if (filtrosAplicados.objetivo.includes('outro')) {
          return !padroes.includes(objAluno) || filtrosAplicados.objetivo.includes(objAluno);
        }
        return filtrosAplicados.objetivo.includes(objAluno);
      });
    }

    if (filtrosAplicados.idade?.min) result = result.filter(a => (a.idade || 0) >= parseInt(filtrosAplicados.idade.min));
    if (filtrosAplicados.idade?.max) result = result.filter(a => (a.idade || 0) <= parseInt(filtrosAplicados.idade.max));
    
    setAlunosFiltrados(aplicarOrdenacao(result, filtrosAplicados.ordem));
  }, [busca, filtrosAplicados, alunos]);

  // =========================================================
  // handlers de ações
  // =========================================================
  const handleDeletarAluno = async () => {
    if (!alunoParaDeletar) return;
    try {
      const res = await fetch(`http://localhost:3000/alunos/${alunoParaDeletar._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAlunos(alunos.filter((a) => a._id !== alunoParaDeletar._id));
      setMostrarConfirmacao(false);
      showAlert("aluno removido com sucesso", "success");
    } catch {
      showAlert("erro ao excluir aluno", "error");
    }
  };

  // =========================================================
  // renderização de sub-componentes
  // =========================================================
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

  if (loading) return null;

  // =========================================================
  // template principal (jsx)
  // =========================================================
  return (
    <div className="w-full pb-20">
      <Alert message={alert.message} type={alert.type} />

      {/* header: título, nome do personal e busca rápida */}
      <header className="px-4 md:px-0 mt-6 md:mt-12 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 overflow-visible">
            <h1 className="text-2xl md:text-3xl font-[1000] text-gray-900 tracking-[-0.05em] uppercase italic leading-none">Alunos</h1>
            <div className="h-6 w-[2px] bg-gray-200 rotate-[20deg] hidden sm:block"></div>
            <h2 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none">
              <span className="text-gray-400 font-bold">{nomePersonal.split(" ")[0]}</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent pb-[2px]">
                {nomePersonal.split(" ").slice(1).join(" ")}.
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600/50"></span>
            <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em]">{alunosFiltrados.length} encontrados</p>
          </div>
        </div>

        {/* controles de ação */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
            <input 
              type="text" placeholder="buscar..." value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-gray-50 border-none rounded-xl py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-[11px] font-bold w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
            />
          </div>
          <button onClick={() => setMostrarPainel(true)} className={`p-3 md:p-3.5 rounded-xl transition-all ${filtrosAplicados.status.length > 0 || filtrosAplicados.objetivo.length > 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-50 text-gray-400"}`}>
            <FaFilter size={14} />
          </button>
          <button onClick={() => { setAlunoEditando(null); setMostrarModal(true); }} className="bg-black hover:bg-blue-600 text-white p-3 md:p-3.5 rounded-xl shadow-lg active:scale-95 transition-transform">
            <FaUserPlus size={16} />
          </button>
        </div>
      </header>

      {/* barra de filtros ativos */}
      <FiltrosAtivos 
        filtros={filtrosAplicados} 
        removerFiltro={(campo, valor) => {
          const novos = { ...filtrosAplicados, [campo]: filtrosAplicados[campo].filter(v => v !== valor) };
          setFiltrosAplicados(novos); setFiltrosTemporarios(novos);
        }} 
        limparTodos={() => {
          const reset = { status: [], objetivo: [], idade: { min: "", max: "" }, ordem: "nome" };
          setFiltrosAplicados(reset); setFiltrosTemporarios(reset);
        }}
        formatarObjetivo={formatarObjetivo}
        getStatusLabel={getStatusLabel}
      />

      {/* grid de listagem de alunos */}
      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 px-4 md:px-0">
        {currentData.map((aluno) => (
          <div 
            key={aluno._id}
            onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
            className={`bg-white border border-gray-100 rounded-2xl p-3.5 flex flex-col shadow-sm transition-all cursor-pointer ${aluno.status === 'C' ? 'opacity-50 grayscale' : ''}`}
          >
            {renderStatus(aluno.status)}
            <h3 className="font-black text-gray-900 uppercase tracking-tighter text-[10px] leading-tight mb-0.5 truncate">{aluno.nome}</h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase mb-3">{aluno.idade ? `${aluno.idade} anos` : "-- anos"}</span>
            <div className="mt-auto pt-2.5 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[7px] font-black text-blue-600/60 uppercase tracking-widest leading-none">{formatarObjetivo(aluno.objetivo)}</span>
              <button onClick={(e) => { e.stopPropagation(); setAlunoEditando(aluno); setMostrarModal(true); }} className="text-gray-200 active:text-blue-600 transition-colors hover:text-blue-400">
                <FaEdit size={15} />
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* rodapé com paginação */}
      <footer className="mt-10 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} />
      </footer>

      {/* modais e painéis suspensos */}
      {mostrarModal && (
        <ModalAluno 
          aluno={alunoEditando} 
          showAlert={showAlert} 
          onClose={() => setMostrarModal(false)}
          onSave={(alunoSalvo) => {
            const novaLista = alunoEditando ? alunos.map((a) => (a._id === alunoSalvo._id ? alunoSalvo : a)) : [...alunos, alunoSalvo];
            setAlunos(aplicarOrdenacao(novaLista, filtrosAplicados.ordem));
            setMostrarModal(false);
          }}
          onDelete={(aluno) => { setAlunoParaDeletar(aluno); setMostrarConfirmacao(true); setMostrarModal(false); }}
        />
      )}

      {mostrarConfirmacao && (
        <ModalConfirmacao 
          isOpen={mostrarConfirmacao} onConfirm={handleDeletarAluno} isCritical={true} title="Excluir Aluno"
          message={<>tem certeza que deseja excluir <span className="text-white font-[1000] underline">permanentemente</span> o aluno {alunoParaDeletar?.nome}?</>}
          onClose={() => { setMostrarConfirmacao(false); setMostrarModal(true); }}
        />
      )}
      
      <PainelFiltro 
        isOpen={mostrarPainel} onClose={() => setMostrarPainel(false)} 
        onApply={(f) => { setFiltrosAplicados(f); setMostrarPainel(false); }} 
        filters={filtrosTemporarios} setFilters={setFiltrosTemporarios} 
      />
    </div>
  );
}