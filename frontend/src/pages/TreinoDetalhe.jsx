import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ModalExercicio from "../components/modals/ModalExercicio";
import ModalExercicioTreino from "../components/modals/ModalExercicioTreino";
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
  const { id: personalId, alunoId, projetoId, treinoId } = useParams();
  const navigate = useNavigate();

  const [treino, setTreino] = useState(null);
  const [exerciciosBiblioteca, setExerciciosBiblioteca] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // estados para controle dos modais
  const [isBuscadorOpen, setIsBuscadorOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [nomeSugerido, setNomeSugerido] = useState("");

  async function carregarDados() {
    try {
      // 1. busca os dados do treino
      const resTreino = await fetch(`http://localhost:3000/treinos/${treinoId}`);
      if (!resTreino.ok) throw new Error("treino não encontrado");
      const dataTreino = await resTreino.json();
      setTreino({ ...dataTreino, exercicios: dataTreino.exercicios || [] });

      // 2. busca a biblioteca global para o buscador novo
      const resEx = await fetch(`http://localhost:3000/exercicios?fk_personal=${personalId}`);
      const dataEx = await resEx.json();
      setExerciciosBiblioteca(dataEx);
    } catch (err) {
      console.error(err);
      setTreino(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [treinoId, personalId]);

  // fluxo: adicionar exercício existente da biblioteca diretamente ao treino
  const handleAdicionarExercicioExistente = async (exercicio) => {
    try {
      const novaRelacao = {
        fk_exercicio: exercicio._id,
        series: "3",
        repeticoes: "12",
        descanso: "60s"
      };

      const res = await fetch(`http://localhost:3000/treinos/${treino._id}/exercicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaRelacao),
      });

      if (res.ok) {
        await carregarDados(); // atualiza a lista na tela
        setIsBuscadorOpen(false); // fecha o buscador
      }
    } catch (err) {
      console.error("erro ao adicionar ao treino:", err);
    }
  };

  // fluxo: abre o cadastro de novo exercício vindo do buscador
  const handleAbrirCadastroPeloBuscador = (nomeDigitado) => {
    setNomeSugerido(nomeDigitado);
    setIsBuscadorOpen(false);
    setIsCadastroOpen(true);
  };

  // fluxo: salva novo exercício na biblioteca e já insere no treino atual
  const handleSalvarNovoECadastrarNoTreino = async (dadosForm) => {
    try {
      const resNovo = await fetch(`http://localhost:3000/exercicios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosForm)
      });
      const novoEx = await resNovo.json();

      if (resNovo.ok) {
        await handleAdicionarExercicioExistente(novoEx);
        setIsCadastroOpen(false);
      }
    } catch (err) {
      console.error("erro no cadastro rápido:", err);
    }
  };

  if (loading) return null;
  if (!treino) return <div className="p-10 text-center font-black uppercase text-gray-400">treino não encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 md:px-0 pt-10">
      
      {/* botão voltar */}
      <button
        onClick={() => navigate(`/${personalId}/alunos/${alunoId}/projetos/${projetoId}`)}
        className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest mb-8 transition-colors"
      >
        <FaArrowLeft size={10} /> voltar ao projeto
      </button>

      {/* header do treino */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <span className="bg-blue-600 text-[9px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest">
            protocolo de treino
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

        {/* botão adicionar: abre o novo buscador inteligente */}
        <button 
          onClick={() => setIsBuscadorOpen(true)}
          className="bg-black hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-3 shadow-lg active:scale-95 group"
        >
          <div className="relative">
            <FaDumbbell size={14} className="group-hover:rotate-[-15deg] transition-transform" />
            <div className="absolute -top-1 -right-1.5 bg-blue-600 group-hover:bg-black text-white rounded-full p-[0.5px] border border-black group-hover:border-blue-600 transition-colors">
              <FaPlus size={5} />
            </div>
          </div>
          adicionar exercício
        </button>
      </div>

      <hr className="border-gray-100 mb-10" />

      {/* lista de exercícios */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
          ordem de execução <div className="h-px bg-gray-100 flex-1"></div>
        </h2>

        {treino.exercicios.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              nenhum exercício na lista. comece agora.
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
                      {ex.fk_exercicio?.nome || "exercício"}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5">
                        <FaLayerGroup size={10} className="text-gray-300" />
                        <span className="text-[10px] font-black text-gray-500 uppercase italic">
                          {ex.series} <span className="text-gray-300">séries</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 border-l border-gray-100 pl-4">
                        <FaDumbbell size={10} className="text-gray-300" />
                        <span className="text-[10px] font-black text-gray-500 uppercase italic">
                          {ex.repeticoes} <span className="text-gray-300">reps</span>
                        </span>
                      </div>
                      {ex.carga && (
                        <div className="bg-blue-50 px-2 py-0.5 rounded text-blue-600 text-[9px] font-black uppercase">
                          {ex.carga}
                        </div>
                      )}
                      {ex.descanso && (
                        <div className="flex items-center gap-1.5 text-orange-500 border-l border-gray-100 pl-4">
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

      {/* 1. buscador dinâmico (modalexerciciotreino) */}
      <ModalExercicioTreino 
        isOpen={isBuscadorOpen}
        onClose={() => setIsBuscadorOpen(false)}
        exerciciosBiblioteca={exerciciosBiblioteca}
        onSelectExercicio={handleAdicionarExercicioExistente}
        onOpenCadastroRapido={handleAbrirCadastroPeloBuscador}
      />

      {/* 2. cadastro original (só abre se clicar no + do buscador) */}
      {isCadastroOpen && (
        <ModalExercicio
          personalId={personalId}
          exercicioParaEditar={nomeSugerido ? { nome: nomeSugerido } : null}
          onClose={() => setIsCadastroOpen(false)}
          onSave={handleSalvarNovoECadastrarNoTreino}
        />
      )}
    </div>
  );
}