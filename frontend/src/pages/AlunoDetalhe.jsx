import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import ModalAluno from "../components/modals/ModalAluno";
import ModalNovoProjeto from "../components/modals/ModalProjeto";
import ModalConfirmacao from "../components/modals/ModalConfirmacao";
import StatusDot from "../components/StatusDot";
import { useAlert } from "../components/hooks/useAlert";
import Alert from "../components/Alert";
import { 
  FaArrowLeft, 
  FaDumbbell, 
  FaChevronRight, 
  FaCalendarAlt,
  FaWhatsapp,
  FaEdit,
  FaBullseye,
  FaPlus 
} from "react-icons/fa";

export default function AlunoDetalhe() {
  const { personalId, alunoId } = useParams();
  const navigate = useNavigate();
  const { alert, showAlert } = useAlert(2000);

  const [aluno, setAluno] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [treinosPorProjeto, setTreinosPorProjeto] = useState({});
  
  const [mostrarModalEdit, setMostrarModalEdit] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarModalProjeto, setMostrarModalProjeto] = useState(false);
  const [projetoParaEditar, setProjetoParaEditar] = useState(null);

  const objetivosMap = {
    hipertrofia: "hipertrofia",
    emagrecimento: "emagrecimento",
    definicao: "definição",
    saude: "saúde",
    reabilitacao: "reabilitação",
    manutencao: "manutenção"
  };

  const statusLabels = {
    R: "Rascunho",
    AG: "Agendado",
    A: "Ativo",
    F: "Finalizado",
    C: "Cancelado"
  };

  // Função para calcular idade baseada na data de nascimento
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

  const handleWhatsappClick = () => {
    if (aluno?.whatsapp) {
      const numeroLimpo = aluno.whatsapp.replace(/\D/g, "");
      const ddiLimpo = aluno.ddi ? aluno.ddi.replace(/\D/g, "") : "55";
      const url = `https://wa.me/${ddiLimpo}${numeroLimpo}`;
      window.open(url, "_blank");
    } else {
      showAlert("whatsapp não cadastrado", "error");
    }
  };

  const renderNomeEstilizado = (nomeCompleto) => {
    if (!nomeCompleto) return "";
    const nomes = nomeCompleto.trim().split(/\s+/);
    if (nomes.length === 1) return nomeCompleto;
    const primeiro = nomes[0];
    const resto = nomes.slice(1).join(" ");
    return (
      <>
        {primeiro} <span className="text-blue-500">{resto}</span>
      </>
    );
  };

  const handleDeletarAluno = async () => {
    try {
      const response = await fetch(`http://localhost:3000/alunos/${alunoId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      navigate(`/${personalId}/alunos`);
    } catch {
      showAlert("erro ao excluir aluno", "error");
    }
  };

  const carregarTreinosDoProjeto = async (projetoId) => {
    try {
      const endpoints = [
        `http://localhost:3000/treinos/projeto/${projetoId}`,
        `http://localhost:3000/projetos/${projetoId}/treinos`,
        `http://localhost:3000/treinos?projetoId=${projetoId}`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) return data.length;
            if (data.data && Array.isArray(data.data)) return data.data.length;
          }
        } catch (error) {
          continue;
        }
      }
      return 0;
    } catch (error) {
      return 0;
    }
  };

  const carregarDados = useCallback(async () => {
    if (!alunoId) return;
    try {
      setLoading(true);
      
      const resAluno = await fetch(`http://localhost:3000/alunos/${alunoId}`);
      if (!resAluno.ok) throw new Error("aluno não encontrado");
      const alunoData = await resAluno.json();
      setAluno(alunoData);

      const endpoints = [
        `http://localhost:3000/projetos/aluno/${alunoId}`,
        `http://localhost:3000/projetos?alunoId=${alunoId}`,
        `http://localhost:3000/alunos/${alunoId}/projetos`
      ];

      let projetosData = [];
      for (const endpoint of endpoints) {
        try {
          const resProjetos = await fetch(endpoint);
          if (resProjetos.ok) {
            const data = await resProjetos.json();
            const list = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []);
            if (list.length > 0 || endpoint === endpoints[endpoints.length - 1]) {
              projetosData = list;
              break;
            }
          }
        } catch (error) {
          continue;
        }
      }

      const projetosArray = Array.isArray(projetosData) ? projetosData : [];
      setProjetos(projetosArray);

      const treinosMap = {};
      await Promise.all(projetosArray.map(async (projeto) => {
        if (projeto.treinos && Array.isArray(projeto.treinos)) {
          treinosMap[projeto._id] = projeto.treinos.length;
        } else if (projeto.treino && Array.isArray(projeto.treino)) {
          treinosMap[projeto._id] = projeto.treino.length;
        } else {
          const quantidade = await carregarTreinosDoProjeto(projeto._id);
          treinosMap[projeto._id] = quantidade;
        }
      }));

      setTreinosPorProjeto(treinosMap);

    } catch (err) {
      console.error("erro ao carregar dados:", err);
      setAluno(null);
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const abrirModalProjeto = (projeto = null) => {
    setProjetoParaEditar(projeto);
    setMostrarModalProjeto(true);
  };

  const getQuantidadeTreinos = (projeto) => {
    if (treinosPorProjeto[projeto._id] !== undefined) {
      return treinosPorProjeto[projeto._id];
    }
    const treinos = projeto.treinos || projeto.treino || projeto.exercicios || [];
    return Array.isArray(treinos) ? treinos.length : 0;
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto p-10 pt-32 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-8" />
      <div className="h-48 bg-gray-200 rounded-[2rem] mb-10" />
      <div className="space-y-4">
        <div className="h-20 bg-gray-100 rounded-3xl w-full" />
        <div className="h-20 bg-gray-100 rounded-3xl w-full" />
      </div>
    </div>
  );

  if (!aluno) return (
    <div className="p-20 pt-40 text-center">
      <p className="font-black uppercase text-gray-400 tracking-widest">aluno não encontrado</p>
      <button onClick={() => navigate(`/${personalId}/alunos`)} className="mt-4 text-blue-600 text-xs font-bold uppercase underline">voltar para lista</button>
    </div>
  );

  // Calcula a idade do aluno no momento do render
  const idadeCalculada = calcularIdade(aluno.dataNascimento);

  return (
    <div className="max-w-5xl mx-auto pb-24 px-4 md:px-6 pt-10"> 
      <Alert message={alert.message} type={alert.type} />
      
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(`/${personalId}/alunos`)}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
        >
          <FaArrowLeft size={10} /> voltar para lista
        </button>

        <div className="flex gap-2">
          <button 
            onClick={handleWhatsappClick}
            className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-90"
          >
            <FaWhatsapp size={16} />
          </button>
          <button 
            onClick={() => setMostrarModalEdit(true)}
            className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
          >
            <FaEdit size={16} />
          </button>
        </div>
      </div>

      <div className="bg-black rounded-[2rem] p-6 md:p-10 text-white shadow-xl mb-12 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-4xl font-black italic shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-all duration-500 text-white">
              {aluno.nome.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <StatusDot status={aluno.status} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">aluno {aluno.status === 'A' ? 'ativo' : 'inativo'}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                {renderNomeEstilizado(aluno.nome)}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-12 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-12">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-blue-500" /> idade
              </p>
              <p className="text-2xl font-black italic">
                {idadeCalculada || "--"} <span className="text-[10px] not-italic text-gray-400">anos</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                <FaBullseye className="text-blue-500" /> objetivo
              </p>
              <p className="text-2xl font-black italic uppercase text-blue-500 leading-tight">
                {objetivosMap[aluno.objetivo?.toLowerCase()] || aluno.objetivo || "geral"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <FaDumbbell size={200} className="rotate-12" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-end justify-between px-1">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Projetos
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              programação de treinos
            </p>
          </div>

          <button
            onClick={() => abrirModalProjeto()}
            className="group flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-xl active:scale-95 transition-all"
          >
            <FaPlus size={10}/> 
            Novo Projeto
          </button>
        </div>

        {projetos.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
              <FaDumbbell size={32} />
            </div>
            <p className="text-gray-300 font-bold uppercase text-[10px] tracking-[0.2em]">Nenhuma planilha montada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projetos.map((projeto) => {
              const quantidadeTreinos = getQuantidadeTreinos(projeto);
              
              return (
                <div
                  key={projeto._id}
                  onClick={() => navigate(`/${personalId}/alunos/${alunoId}/projetos/${projeto._id}`)}
                  className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-blue-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-500 shadow-inner">
                      <FaDumbbell size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5 ml-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          projeto.status === 'A' ? 'bg-green-500 animate-pulse' : 
                          projeto.status === 'AG' ? 'bg-yellow-500' :
                          projeto.status === 'F' ? 'bg-blue-500' :
                          projeto.status === 'C' ? 'bg-red-500' : 'bg-gray-300'
                        }`} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                          {statusLabels[projeto.status] || projeto.status}
                        </span>
                      </div>

                      <h3 className="font-[1000] text-gray-900 text-xl uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">
                        {projeto.nome}
                      </h3>
                      
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                        {quantidadeTreinos} {quantidadeTreinos === 1 ? 'treino cadastrado' : 'treinos cadastrados'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModalProjeto(projeto);
                      }}
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                    >
                      <FaEdit size={12} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
                      <FaChevronRight size={10} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modais omitidos para brevidade, mas devem permanecer iguais */}
      {mostrarModalProjeto && (
        <ModalNovoProjeto
          alunoId={alunoId}
          personalId={personalId}
          projeto={projetoParaEditar}
          onClose={() => {
            setMostrarModalProjeto(false);
            setProjetoParaEditar(null);
          }}
          onCreated={() => {
            setMostrarModalProjeto(false);
            carregarDados();
          }}
        />
      )}

      {mostrarModalEdit && (
        <ModalAluno
          aluno={aluno}
          showAlert={showAlert}
          onClose={() => setMostrarModalEdit(false)}
          onSave={(alunoSalvo) => {
            setAluno(alunoSalvo);
            setMostrarModalEdit(false);
            showAlert("dados atualizados!", "success");
          }}
          onDelete={() => {
            setMostrarConfirmacao(true);
            setMostrarModalEdit(false);
          }}
        />
      )}

      {mostrarConfirmacao && (
        <ModalConfirmacao
          isOpen={mostrarConfirmacao}
          onConfirm={handleDeletarAluno}
          isCritical={true}
          title="Excluir Aluno"
          message={<>tem certeza que deseja excluir o aluno {aluno?.nome}?</>}
          onClose={() => {
            setMostrarConfirmacao(false);
            setMostrarModalEdit(true);
          }}
        />
      )}
    </div>
  );
}