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
import { FaEdit, FaFilter, FaSearch, FaUserPlus, FaUsersSlash } from "react-icons/fa";

export default function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [nomePersonal, setNomePersonal] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [alunoParaDeletar, setAlunoParaDeletar] = useState(null);

  const [filtrosTemporarios, setFiltrosTemporarios] = useState({ 
    status: [], objetivo: "", idade: { min: "", max: "" }, ordem: "nome"
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({ 
    status: [], objetivo: "", idade: { min: "", max: "" }, ordem: "nome"
  });

  const { personalId } = useParams(); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { alert, showAlert } = useAlert(2000);
  
  const { currentData, currentPage, totalPages, goToPage, totalItems } = usePagination(alunosFiltrados, 30);

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const formatarObjetivo = (texto) => {
    if (!texto) return "GERAL";
    const mapa = {
      "manutencao": "manutenção", "emagrecimento": "emagrecimento",
      "hipertrofia": "hipertrofia", "definicao": "definição",
      "saude": "saúde", "reabilitacao": "reabilitação"
    };
    return (mapa[texto.toLowerCase()] || texto).toUpperCase();
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

  useEffect(() => {
    async function buscarDados() {
      try {
        const resAlunos = await fetch(`http://localhost:3000/alunos?fk_personal=${personalId}`);
        const dataAlunos = await resAlunos.json();
        setAlunos(aplicarOrdenacao(dataAlunos, "nome"));

        const statusUrl = searchParams.get("status");
        if (statusUrl) {
          const filtroInicial = { status: [statusUrl], objetivo: "", idade: { min: "", max: "" }, ordem: "nome" };
          setFiltrosAplicados(filtroInicial);
          setFiltrosTemporarios(filtroInicial);
        }

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

  useEffect(() => {
    let result = alunos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()));
    
    if (filtrosAplicados.status.length > 0) {
      result = result.filter(a => filtrosAplicados.status.includes(a.status));
    }
    
    if (filtrosAplicados.objetivo && filtrosAplicados.objetivo.trim() !== "") {
      const termo = filtrosAplicados.objetivo.toLowerCase();
      result = result.filter(a => a.objetivo?.toLowerCase().includes(termo));
    }

    if (filtrosAplicados.idade?.min) {
      result = result.filter(a => {
        const idade = calcularIdade(a.dataNascimento);
        return idade >= parseInt(filtrosAplicados.idade.min);
      });
    }
    if (filtrosAplicados.idade?.max) {
      result = result.filter(a => {
        const idade = calcularIdade(a.dataNascimento);
        return idade <= parseInt(filtrosAplicados.idade.max);
      });
    }
    
    setAlunosFiltrados(aplicarOrdenacao(result, filtrosAplicados.ordem));
  }, [busca, filtrosAplicados, alunos]);

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

  // --- Tela de Estado Vazio (Nenhum aluno cadastrado) ---
  if (alunos.length === 0) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Alert message={alert.message} type={alert.type} />
        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-6 shadow-inner">
          <FaUsersSlash size={40} />
        </div>
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Nenhum aluno por aqui</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Sua lista está vazia. Comece cadastrando um novo aluno.</p>
        </div>
        <button 
          onClick={() => { setAlunoEditando(null); setMostrarModal(true); }}
          className="group flex items-center gap-3 bg-gray-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl transition-all active:scale-95"
        >
          <FaUserPlus size={18} />
          <span className="text-xs font-black uppercase tracking-widest">Cadastrar Primeiro Aluno</span>
        </button>

        {mostrarModal && (
          <ModalAluno 
            aluno={null} 
            showAlert={showAlert} 
            onClose={() => setMostrarModal(false)}
            onSave={(alunoSalvo) => {
              setAlunos([alunoSalvo]);
              setMostrarModal(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full pb-20">
      <Alert message={alert.message} type={alert.type} />

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

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
            <input 
              type="text" placeholder="buscar..." value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="bg-gray-50 border-none rounded-xl py-2.5 md:py-3 pl-9 md:pl-10 pr-4 text-[11px] font-bold w-full md:w-64 outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
            />
          </div>
          <button onClick={() => setMostrarPainel(true)} 
            className={`p-3 md:p-3.5 rounded-xl transition-all ${filtrosAplicados.status.length > 0 || filtrosAplicados.objetivo !== "" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-50 text-gray-400"}`}>
            <FaFilter size={14} />
          </button>
          <button onClick={() => { setAlunoEditando(null); setMostrarModal(true); }} className="bg-black hover:bg-blue-600 text-white p-3 md:p-3.5 rounded-xl shadow-lg active:scale-95 transition-transform">
            <FaUserPlus size={16} />
          </button>
        </div>
      </header>

      <FiltrosAtivos 
        filtros={filtrosAplicados} 
        removerFiltro={(campo, valor) => {
          const novos = { ...filtrosAplicados };
          if (campo === 'objetivo') {
            novos.objetivo = "";
          } else if (campo === 'idade') {
            novos.idade = { min: "", max: "" };
          } else {
            novos[campo] = filtrosAplicados[campo].filter(v => v !== valor);
          }
          setFiltrosAplicados(novos); 
          setFiltrosTemporarios(novos);
        }} 
        limparTodos={() => {
          const reset = { status: [], objetivo: "", idade: { min: "", max: "" }, ordem: "nome" };
          setFiltrosAplicados(reset); 
          setFiltrosTemporarios(reset);
        }}
        formatarObjetivo={formatarObjetivo}
        getStatusLabel={getStatusLabel}
      />

      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 px-4 md:px-0">
        {currentData.map((aluno) => {
          const idadeCalculada = calcularIdade(aluno.dataNascimento);
          
          return (
            <div 
              key={aluno._id}
              onClick={() => navigate(`/${personalId}/alunos/${aluno._id}`)}
              className={`bg-white border border-gray-100 rounded-2xl p-3.5 flex flex-col shadow-sm transition-all cursor-pointer hover:shadow-md hover:border-blue-100 ${aluno.status === 'C' ? 'opacity-50 grayscale' : ''}`}
            >
              {renderStatus(aluno.status)}
              <h3 className="font-black text-gray-900 uppercase tracking-tighter text-[10px] leading-tight mb-0.5 truncate">{aluno.nome}</h3>
              <span className="text-[9px] font-bold text-gray-400 uppercase mb-3">
                {idadeCalculada ? `${idadeCalculada} anos` : "-- anos"}
              </span>
              <div className="mt-auto pt-2.5 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[7px] font-black text-blue-600/60 uppercase tracking-widest leading-none truncate pr-2">{formatarObjetivo(aluno.objetivo)}</span>
                <button onClick={(e) => { e.stopPropagation(); setAlunoEditando(aluno); setMostrarModal(true); }} className="text-gray-200 active:text-blue-600 transition-colors hover:text-blue-600">
                  <FaEdit size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </main>

      <footer className="mt-10 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} totalItems={totalItems} />
      </footer>

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