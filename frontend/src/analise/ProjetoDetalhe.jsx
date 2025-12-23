import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaPlus,
  FaCalendarAlt,
  FaBullseye,
  FaDumbbell,
  FaEllipsisV,
  FaCheckCircle,
  FaPauseCircle,
  FaTimesCircle
} from "react-icons/fa";
import ModalNovoTreino from "../components/modals/ModalNovoTreino";

export default function ProjetoDetalhe() {
  const { id: personalId, alunoId, projetoId } = useParams();
  const navigate = useNavigate();

  const [projeto, setProjeto] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mostrarModalNovoTreino, setMostrarModalNovoTreino] = useState(false);

  useEffect(() => {
    async function carregarProjeto() {
      try {
        const res = await fetch(`http://localhost:3000/projetos/${projetoId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        console.log("RESPOSTA PROJETO:", data);

        setProjeto(data.projeto);
        setTreinos(data.treinos || []);
      } catch {
        setProjeto(null);
      } finally {
        setLoading(false);
      }
    }

    carregarProjeto();
  }, [projetoId]);

  if (loading) return null;

  if (!projeto) {
    return (
      <div className="p-10 text-center font-black uppercase text-gray-400">
        Projeto não encontrado
      </div>
    );
  }

  const statusColor = {
    RASCUNHO: "bg-gray-400",
    ATIVO: "bg-green-600",
    CONCLUIDO: "bg-blue-600",
    CANCELADO: "bg-red-600"
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 md:px-0">

      {/* voltar */}
      <button
        onClick={() => navigate(`/${personalId}/alunos/${alunoId}`)}
        className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest mb-8"
      >
        <FaArrowLeft size={10} /> Voltar ao aluno
      </button>

      {/* header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <span
            className={`${statusColor[projeto.status]} text-[9px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest`}
          >
            {projeto.status}
          </span>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">
            {projeto.nome}
          </h1>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-gray-500">
            <div className="flex items-center gap-1.5">
              <FaBullseye size={12} />
              <span className="text-[10px] font-bold uppercase">
                {projeto.objetivo}
              </span>
            </div>

            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
              <FaCalendarAlt size={12} />
              <span className="text-[10px] font-bold uppercase">
                {projeto.data_inicio || "sem início"} → {projeto.data_fim}
              </span>
            </div>

            <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
              <FaDumbbell size={12} />
              <span className="text-[10px] font-bold uppercase">
                {treinos.length} treinos
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        {projeto.status === "ATIVO" && (
          <button
            onClick={() => setMostrarModalNovoTreino(true)}
            className="bg-black hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 shadow-lg active:scale-95"
          >
            <FaPlus size={10} /> Adicionar Treino
          </button>
        )}
      </div>

      <hr className="border-gray-100 mb-10" />

      {/* lista de treinos */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          Ordem de Treinos <div className="h-px bg-gray-100 flex-1"></div>
        </h2>

        {treinos.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Nenhum treino criado neste projeto
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {treinos.map((treino, index) => (
              <div
                key={treino._id}
                onClick={() =>
                  navigate(
                    `/${personalId}/alunos/${alunoId}/treinos/${treino._id}`
                  )
                }
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-green-200 transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black italic text-sm">
                    {String(treino.ordem).padStart(2, "0")}
                  </div>

                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight group-hover:text-green-600">
                      {treino.nome}
                    </h3>
                    <p className="text-[10px] font-bold uppercase text-gray-400">
                      {treino.exercicios?.length || 0} exercícios
                    </p>
                  </div>
                </div>

                <button className="text-gray-200 hover:text-black p-2">
                  <FaEllipsisV />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {mostrarModalNovoTreino && (
        <ModalNovoTreino
            alunoId={alunoId}
            projetoId={projetoId}
            personalId={personalId}
            onClose={() => setMostrarModalNovoTreino(false)}
            onCreated={(novoTreino) => {
            setTreinos((prev) => [...prev, novoTreino]);
            setMostrarModalNovoTreino(false);
            }}
        />
      )}
    </div>
  );
}
