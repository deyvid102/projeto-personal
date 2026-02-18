import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaCalendarAlt,
  FaBullseye,
  FaDumbbell,
  FaEdit,
  FaChevronRight
} from "react-icons/fa";

import ModalTreino from "../components/modals/ModalTreino"; 
import ModalProjeto from "../components/modals/ModalProjeto"; // Importado para permitir a edição

export default function ProjetoDetalhe() {
  const { personalId, alunoId, projetoId } = useParams();
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModalTreino, setMostrarModalTreino] = useState(false);
  const [treinoParaEditar, setTreinoParaEditar] = useState(null);
  const [mostrarModalProjeto, setMostrarModalProjeto] = useState(false);

  const carregarProjeto = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/projetos/${projetoId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      setProjeto(data.projeto);
      setTreinos(data.treinos || []);
    } catch (err) {
      console.error("erro ao carregar projeto:", err);
      setProjeto(null);
    } finally {
      setLoading(false);
    }
  }, [projetoId]);

  useEffect(() => {
    carregarProjeto();
  }, [carregarProjeto]);

  const abrirModalTreino = (treino = null) => {
    setTreinoParaEditar(treino);
    setMostrarModalTreino(true);
  };

  const handleCreated = () => {
    carregarProjeto();
    setMostrarModalTreino(false);
    setTreinoParaEditar(null);
  };

  const statusLabels = {
    R: "Rascunho",
    AG: "Agendado",
    A: "Ativo",
    F: "Finalizado",
    C: "Cancelado"
  };

  const ordemDias = { "SEG": 1, "TER": 2, "QUA": 3, "QUI": 4, "SEX": 5, "SAB": 6, "DOM": 7 };

  const formatarData = (data) => {
    if (!data) return "--";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(new Date(data));
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto p-10 pt-32 animate-pulse font-black uppercase text-gray-300 tracking-widest text-center">
      carregando_
    </div>
  );

  if (!projeto) return (
    <div className="p-20 text-center font-black uppercase text-red-400">
      projeto não encontrado
    </div>
  );

  const treinosOrdenados = [...treinos].sort((a, b) => {
    const diaA = Array.isArray(a.dia_semana) ? a.dia_semana[0] : a.dia_semana;
    const diaB = Array.isArray(b.dia_semana) ? b.dia_semana[0] : b.dia_semana;
    return (ordemDias[diaA] || 99) - (ordemDias[diaB] || 99);
  });

  return (
    <div className="max-w-5xl mx-auto pb-24 px-4 md:px-8 pt-10">
      
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => navigate(`/${personalId}/alunos/${alunoId}`)}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
        >
          <FaArrowLeft size={10} /> voltar ao perfil
        </button>

        <button 
          onClick={() => setMostrarModalProjeto(true)}
          className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
        >
          <FaEdit size={16} />
        </button>
      </div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 px-1">
            <span className="relative flex h-2 w-2">
              {projeto.status === 'A' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                projeto.status === 'A' ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              projeto.status === 'A' ? 'text-green-600' : 'text-gray-400'
            }`}>
              {statusLabels[projeto.status] || projeto.status}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-[1000] tracking-tighter italic uppercase leading-[0.85] text-gray-900">
            {projeto.nome}<span className="text-blue-600">_</span>
          </h1>

          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 pt-2">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                <FaBullseye className="text-blue-500" size={10} /> objetivo
              </p>
              <p className="text-xl font-black italic uppercase text-gray-800">{projeto.objetivo}</p>
            </div>
            <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                <FaCalendarAlt className="text-blue-500" size={10} /> período
              </p>
              <p className="text-xl font-black italic text-gray-800">
                {formatarData(projeto.data_inicio)} <span className="text-gray-300 mx-1">•</span> {formatarData(projeto.data_fim)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => abrirModalTreino()}
          className="group flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-xl active:scale-95 transition-all w-full md:w-auto justify-center"
        >
          <FaPlus size={10} /> adicionar treino
        </button>
      </header>

      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-[11px] font-[1000] uppercase tracking-[0.3em] text-gray-400 whitespace-nowrap">
            cronograma semanal
          </h2>
          <div className="h-[1px] bg-gray-100 w-full" />
        </div>

        {treinosOrdenados.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-20 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
              <FaDumbbell size={32} />
            </div>
            <p className="text-gray-300 font-bold uppercase text-[10px] tracking-[0.2em]">nenhum treino vinculado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {treinosOrdenados.map((treino) => (
              <div
                key={treino._id}
                onClick={() => navigate(`/${personalId}/alunos/${alunoId}/projetos/${projeto._id}/treinos/${treino._id}`)}
                className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-5 overflow-hidden">
                  <div className="flex flex-wrap gap-1.5 w-14 h-14 items-center justify-center shrink-0">
                    {(Array.isArray(treino.dia_semana) ? treino.dia_semana : [treino.dia_semana]).map((dia, idx, arr) => (
                      <div 
                        key={dia}
                        className={`
                          ${arr.length === 1 ? 'w-14 h-14 text-sm' : 'w-6 h-6 text-[7px]'} 
                          rounded-xl bg-gray-50 group-hover:bg-blue-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-500 shadow-inner font-black italic
                        `}
                      >
                        {dia}
                      </div>
                    ))}
                  </div>

                  <div className="truncate">
                    <h3 className="font-[1000] text-gray-900 text-xl uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors leading-tight truncate">
                      {treino.nome}_
                    </h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mt-0.5">
                      {treino.exercicios?.length || 0} exercícios na série
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      abrirModalTreino(treino); 
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
            ))}
          </div>
        )}
      </section>

      {mostrarModalTreino && (
        <ModalTreino
          projetoId={projetoId}
          personalId={personalId}
          treino={treinoParaEditar}
          onClose={() => { setMostrarModalTreino(false); setTreinoParaEditar(null); }}
          onCreated={handleCreated}
        />
      )}

      {mostrarModalProjeto && (
        <ModalProjeto
          alunoId={alunoId}
          personalId={personalId}
          projeto={projeto}
          onClose={() => setMostrarModalProjeto(false)}
          onCreated={() => {
            setMostrarModalProjeto(false);
            carregarProjeto();
          }}
        />
      )}
    </div>
  );
}