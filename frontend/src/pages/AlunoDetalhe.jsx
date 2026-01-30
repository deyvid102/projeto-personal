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
  FaBullseye 
} from "react-icons/fa";

export default function AlunoDetalhe() {
  // Ajustado para capturar personalId conforme rota do App.jsx
  const { personalId, alunoId } = useParams();
  const navigate = useNavigate();
  const { alert, showAlert } = useAlert(2000);

  const [aluno, setAluno] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [mostrarModalEdit, setMostrarModalEdit] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [mostrarModalProjeto, setMostrarModalProjeto] = useState(false);

  const objetivosMap = {
    hipertrofia: "hipertrofia",
    emagrecimento: "emagrecimento",
    definicao: "definição",
    saude: "saúde",
    reabilitacao: "reabilitação",
    manutencao: "manutenção"
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

  const carregarDados = useCallback(async () => {
    // Garante que o alunoId existe antes de disparar o fetch
    if (!alunoId) return;

    try {
      setLoading(true);
      const [resAluno, resProjetos] = await Promise.all([
        fetch(`http://localhost:3000/alunos/${alunoId}`),
        fetch(`http://localhost:3000/projetos/aluno/${alunoId}`)
      ]);
      
      if (!resAluno.ok) throw new Error("aluno não encontrado");
      
      const alunoData = await resAluno.json();
      const projetosData = await resProjetos.json();
      
      setAluno(alunoData);
      setProjetos(Array.isArray(projetosData) ? projetosData : []);
    } catch (err) {
      console.error(err);
      setAluno(null);
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  if (loading) return (
    <div className="max-w-5xl mx-auto p-10 pt-32 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-8" />
      <div className="h-48 bg-gray-200 rounded-[2rem] mb-10" />
    </div>
  );

  if (!aluno) return (
    <div className="p-20 pt-40 text-center">
        <p className="font-black uppercase text-gray-400 tracking-widest">aluno não encontrado</p>
        <button onClick={() => navigate(`/${personalId}/alunos`)} className="mt-4 text-blue-600 text-xs font-bold uppercase underline">voltar para lista</button>
    </div>
  );

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
              title="contato via whatsapp"
              className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-90"
            >
                <FaWhatsapp size={14} />
            </button>
            <button 
              onClick={() => setMostrarModalEdit(true)}
              title="editar aluno"
              className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
            >
                <FaEdit size={14} />
            </button>
        </div>
      </div>

      <div className="bg-black rounded-[2rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden mb-10 group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-3xl font-black italic shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform text-white">
              {aluno.nome.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <StatusDot status={aluno.status} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-none">
                {renderNomeEstilizado(aluno.nome)}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-10 border-t md:border-t-0 md:border-l border-white/10 pt-5 md:pt-0 md:pl-10">
            <div className="min-w-max">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <FaCalendarAlt className="text-blue-500" /> idade
              </p>
              <div className="flex items-center gap-3">
                <p className="text-xl font-black italic">
                  {aluno.idade || "--"} <span className="text-[10px] not-italic text-gray-400">anos</span>
                </p>
              </div>
            </div>
            <div className="max-w-xs">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                 <FaBullseye className="text-blue-500" /> objetivo
              </p>
              <p className="text-xl font-black italic uppercase text-blue-500 leading-tight">
                {objetivosMap[aluno.objetivo?.toLowerCase()] || aluno.objetivo || "geral"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
              Projetos
            </h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              programação ativa
            </p>
          </div>

          <button
            onClick={() => setMostrarModalProjeto(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
          >
            + Novo Projeto
          </button>
        </div>

        {projetos.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-16 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4">
                <FaDumbbell size={24} />
            </div>
            <p className="text-gray-300 font-bold uppercase text-[9px] tracking-[0.2em]">Nenhuma planilha montada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projetos.map((projeto) => (
              <div
                key={projeto._id}
                onClick={() => navigate(`/${personalId}/alunos/${alunoId}/projetos/${projeto._id}`)}
                className="group bg-white p-5 rounded-[2.2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-blue-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-300">
                    <FaDumbbell size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">{projeto.nome}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                      {projeto.exercicios?.length || 0} exercícios na série
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <FaChevronRight size={10} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarModalProjeto && (
        <ModalNovoProjeto
          alunoId={alunoId}
          personalId={personalId}
          onClose={() => setMostrarModalProjeto(false)}
          onCreated={(projeto) => {
            setMostrarModalProjeto(false);
            navigate(`/${personalId}/alunos/${alunoId}/projetos/${projeto._id}`);
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
          message={
            <>
              tem certeza que deseja excluir <span className="text-white font-[1000] underline">permanentemente</span> o aluno {aluno?.nome}?
            </>
          }
          onClose={() => {
            setMostrarConfirmacao(false);
            setMostrarModalEdit(true);
          }}
        />
      )}
    </div>
  );
}