import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ModalExercicio from "../components/modals/ModalExercicio";
import ModalExercicioTreino from "../components/modals/ModalExercicioTreino";
import ModalTreino from "../components/modals/ModalTreino";
import ModalConfirmacao from "../components/modals/ModalConfirmacao"; 
import { 
  FaArrowLeft, FaPlus, FaDumbbell, FaClock, 
  FaLayerGroup, FaWeightHanging, FaEdit, FaTrash 
} from "react-icons/fa";

export default function TreinoDetalhe() {
  const params = useParams();
  const navigate = useNavigate();
  const personalId = params.id || params.personalId;
  const { projetoId, treinoId } = params;

  const [treino, setTreino] = useState(null);
  const [exerciciosBiblioteca, setExerciciosBiblioteca] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isBuscadorOpen, setIsBuscadorOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [isEditTreinoOpen, setIsEditTreinoOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [itemParaDeletar, setItemParaDeletar] = useState(null);
  const [nomeSugerido, setNomeSugerido] = useState("");
  const [exercicioParaEditar, setExercicioParaEditar] = useState(null);
  const [novoExercicioCriado, setNovoExercicioCriado] = useState(null);

  async function carregarDados() {
    if (!treinoId) return;
    try {
      setLoading(true);
      const resTreino = await fetch(`http://localhost:3000/treinos/${treinoId}`);
      const dataTreino = await resTreino.json();
      if (dataTreino.exercicios) dataTreino.exercicios.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
      setTreino(dataTreino);

      const resEx = await fetch(`http://localhost:3000/exercicios?fk_personal=${personalId}`);
      const dataEx = await resEx.json();
      setExerciciosBiblioteca(Array.isArray(dataEx) ? dataEx : (dataEx.treinos || []));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  useEffect(() => { carregarDados(); }, [treinoId]);

  const handleSalvarExercicioNoTreino = async (exercicioBase, detalhes) => {
    try {
      const isEdicao = !!exercicioParaEditar;
      const relacaoId = exercicioParaEditar?._id;
      const url = isEdicao 
        ? `http://localhost:3000/treinos/${treinoId}/exercicios/${relacaoId}`
        : `http://localhost:3000/treinos/${treinoId}/exercicios`;

      const res = await fetch(url, {
        method: isEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercicioId: exercicioBase._id || exercicioBase.id,
          series: detalhes.series,
          repeticoes: detalhes.repeticoes,
          carga: detalhes.carga,
          descanso: detalhes.descanso,
          observacoes: detalhes.observacoes
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.exercicios) data.exercicios.sort((a, b) => a.ordem - b.ordem);
        setTreino(data);
        fecharModais();
      }
    } catch (err) { console.error(err); }
  };

  const handleRemoverExercicio = async () => {
    if (!itemParaDeletar) return;
    try {
      const res = await fetch(`http://localhost:3000/treinos/${treinoId}/exercicios/${itemParaDeletar}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        if (data.exercicios) data.exercicios.sort((a, b) => a.ordem - b.ordem);
        setTreino(data);
        fecharModais();
      }
    } catch (err) { console.error(err); }
  };

  const fecharModais = () => {
    setIsBuscadorOpen(false);
    setIsCadastroOpen(false);
    setIsEditTreinoOpen(false);
    setIsDeleteModalOpen(false);
    setExercicioParaEditar(null);
    setItemParaDeletar(null);
    setNovoExercicioCriado(null);
  };

  if (loading) return <div className="max-w-5xl mx-auto p-10 pt-32 animate-pulse font-black text-gray-300 text-center">CARREGANDO_</div>;

  return (
    <div className="max-w-5xl mx-auto pb-24 px-4 md:px-8 pt-10">
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest transition-colors">
          <FaArrowLeft size={10} /> voltar ao projeto
        </button>

        <button 
          onClick={() => setIsEditTreinoOpen(true)}
          className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
        >
          <FaEdit size={16} />
        </button>
      </div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 px-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              {treino.dia_semana ? (Array.isArray(treino.dia_semana) ? treino.dia_semana.join(", ") : treino.dia_semana) : "dia não definido"}
            </span>
          </div>
          
          <h1 onClick={() => setIsEditTreinoOpen(true)} className="text-4xl md:text-6xl font-[1000] tracking-tighter italic uppercase text-gray-900 cursor-pointer hover:text-blue-600 transition-colors leading-none">
            {treino.nome}<span className="text-blue-600">_</span>
          </h1>

          <div className="flex flex-wrap gap-y-4 gap-x-8 pt-2">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-2 mb-1">
                <FaDumbbell className="text-blue-500" size={10} /> volume total
              </p>
              <p className="text-xl font-black italic text-gray-800">
                {treino.exercicios?.length || 0} <span className="text-gray-300 ml-1 italic font-bold text-sm">exercícios</span>
              </p>
            </div>
            {treino.observacoes && (
              <>
                <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />
                <div className="max-w-xs">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-1">notas</p>
                  <p className="text-xs font-bold text-gray-500 line-clamp-2">{treino.observacoes}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsBuscadorOpen(true)} 
          className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-xl active:scale-95 transition-all w-full md:w-auto justify-center"
        >
          <FaPlus size={10} /> adicionar exercício
        </button>
      </header>

      <section className="space-y-4">
        {treino.exercicios.map((ex, index) => (
          <div key={ex._id || index} className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="flex items-center gap-6 overflow-hidden">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-50 group-hover:bg-blue-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-500 font-[1000] italic text-lg shadow-inner">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="truncate">
                <h3 className="font-[1000] text-gray-900 text-xl uppercase tracking-tighter italic leading-tight truncate">
                  {ex.fk_exercicio?.nome || "exercício_"}
                </h3>
                <div className="flex flex-wrap gap-x-5 mt-1">
                  <div className="flex items-center gap-1.5"><FaLayerGroup size={10} className="text-blue-500"/><span className="text-[10px] font-black text-gray-500 uppercase">{ex.series} séries</span></div>
                  <div className="flex items-center gap-1.5"><FaDumbbell size={10} className="text-blue-500"/><span className="text-[10px] font-black text-gray-500 uppercase">{ex.repeticoes} reps</span></div>
                  {ex.carga && <div className="flex items-center gap-1.5"><FaWeightHanging size={10} className="text-blue-600"/><span className="text-[10px] font-black text-blue-600 uppercase italic">{ex.carga}</span></div>}
                  {ex.descanso && <div className="flex items-center gap-1.5"><FaClock size={10} className="text-gray-400"/><span className="text-[10px] font-black text-gray-400 uppercase">{ex.descanso}</span></div>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 ml-4 shrink-0">
              <button onClick={() => { setExercicioParaEditar(ex); setIsBuscadorOpen(true); }} className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all"><FaEdit size={14} /></button>
              <button onClick={() => { setItemParaDeletar(ex._id); setIsDeleteModalOpen(true); }} className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all"><FaTrash size={14} /></button>
            </div>
          </div>
        ))}
      </section>

      <ModalExercicioTreino 
        isOpen={isBuscadorOpen} 
        onClose={fecharModais} 
        exerciciosBiblioteca={exerciciosBiblioteca}
        onSelectExercicio={handleSalvarExercicioNoTreino}
        exercicioParaEditar={exercicioParaEditar}
        exercicioCriadoNoMomento={novoExercicioCriado}
        onOpenCadastroRapido={(n) => { setNomeSugerido(n); setIsBuscadorOpen(false); setIsCadastroOpen(true); }}
      />
      
      {isCadastroOpen && (
        <ModalExercicio 
          nomeSugerido={nomeSugerido} 
          bibliotecaExistente={exerciciosBiblioteca}
          onClose={() => { setIsCadastroOpen(false); setIsBuscadorOpen(true); }} 
          onSave={async (exercicioCriado) => {
            await carregarDados(); 
            setNovoExercicioCriado(exercicioCriado); 
            setIsCadastroOpen(false);
            setIsBuscadorOpen(true);
          }} 
        />
      )}

      {isEditTreinoOpen && (
        <ModalTreino
          projetoId={projetoId}
          personalId={personalId}
          treino={treino}
          onClose={fecharModais}
          onCreated={() => {
            carregarDados();
            fecharModais();
          }}
        />
      )}
      
      <ModalConfirmacao
        isOpen={isDeleteModalOpen}
        onClose={fecharModais}
        onConfirm={handleRemoverExercicio}
        title="remover exercício_"
        message="tem certeza que deseja excluir este exercício do treino?"
        isCritical={true}
      />
    </div>
  );
}