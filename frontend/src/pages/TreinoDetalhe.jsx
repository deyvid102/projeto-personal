import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ModalExercicio from "../components/modals/ModalExercicio";
import { 
  FaArrowLeft, 
  FaPlus, 
  FaDumbbell, 
  FaClock, 
  FaLayerGroup, 
  FaStickyNote,
  FaEllipsisV
} from "react-icons/fa";

export default function TreinoDetalhe() {
  const { id: personalId, alunoId, treinoId } = useParams();
  const navigate = useNavigate();

  const [treino, setTreino] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function carregarTreino() {
      try {
        const res = await fetch(`http://localhost:3000/treinos/${treinoId}`);
        if (!res.ok) throw new Error("Treino não encontrado");
        const data = await res.json();
        setTreino({ ...data, exercicios: data.exercicios || [] });
      } catch (err) {
        console.error(err);
        setTreino(null);
      } finally {
        setLoading(false);
      }
    }
    carregarTreino();
  }, [treinoId]);

  if (loading) return null;
  if (!treino) return <div className="p-10 text-center font-black uppercase text-gray-400">Treino não encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 md:px-0">
      
      {/* botão voltar */}
      <button
        onClick={() => navigate(`/${personalId}/alunos/${alunoId}`)}
        className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest mb-8 transition-colors"
      >
        <FaArrowLeft size={10} /> Voltar ao perfil
      </button>

      {/* header do treino */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <span className="bg-blue-600 text-[9px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest">
            Protocolo de Treino
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
            {treino.nome}
          </h1>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-gray-500">
              <FaDumbbell size={12} className="text-blue-600" />
              <span className="text-[10px] font-bold uppercase">{treino.exercicios.length} exercícios</span>
            </div>
            {treino.observacoes && (
              <div className="flex items-center gap-1.5 text-gray-500 border-l border-gray-200 pl-4">
                <FaStickyNote size={12} />
                <span className="text-[10px] font-bold uppercase truncate max-w-[200px]">
                  {treino.observacoes}
                </span>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => setMostrarModal(true)}
          className="bg-black hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg active:scale-95"
        >
          <FaPlus size={10} /> Adicionar Exercício
        </button>
      </div>

      <hr className="border-gray-100 mb-10" />

      {/* lista de exercícios */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          Ordem de Execução <div className="h-px bg-gray-100 flex-1"></div>
        </h2>

        {treino.exercicios.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              Nenhum exercício na lista. comece agora.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {treino.exercicios.map((ex, index) => (
              <div
                key={index}
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-black italic text-sm shadow-lg shadow-gray-200">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {ex.fk_exercicio?.nome || "Exercício"}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5">
                        <FaLayerGroup size={10} className="text-gray-300" />
                        <span className="text-[10px] font-black text-gray-500 uppercase italic">
                          {ex.series} <span className="text-gray-300">SÉRIES</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaDumbbell size={10} className="text-gray-300" />
                        <span className="text-[10px] font-black text-gray-500 uppercase italic">
                          {ex.repeticoes} <span className="text-gray-300">REPS</span>
                        </span>
                      </div>
                      {ex.carga && (
                        <div className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 text-[9px] font-black uppercase">
                          {ex.carga}
                        </div>
                      )}
                      {ex.descanso && (
                        <div className="flex items-center gap-1.5 text-orange-500">
                          <FaClock size={10} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">
                            {ex.descanso}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button className="text-gray-200 hover:text-black p-2 transition-colors">
                   <FaEllipsisV size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* modal de exercício */}
      {mostrarModal && (
        <ModalExercicio
          personalId={personalId}
          onClose={() => setMostrarModal(false)}
          onSave={async (novoExercicio) => {
            const res = await fetch(
              `http://localhost:3000/treinos/${treino._id}/exercicios`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoExercicio),
              }
            );
            const treinoAtualizado = await res.json();
            setTreino(treinoAtualizado);
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
}