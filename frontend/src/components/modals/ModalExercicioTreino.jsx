import { useState, useEffect } from "react";
import { 
  FaSearch, FaPlus, FaDumbbell, FaChevronRight, 
  FaArrowLeft, FaCheck, FaClock, FaRedo, FaWeightHanging, FaTimes 
} from "react-icons/fa";
// O SlideIn geralmente está um nível acima na pasta components
import SlideIn from "../SlideIn";

export default function ModalExercicioTreino({ 
  isOpen, 
  onClose, 
  exerciciosBiblioteca = [], 
  onSelectExercicio, 
  onOpenCadastroRapido,
  exercicioCriadoNoMomento = null,
  exercicioParaEditar = null 
}) {
  const [busca, setBusca] = useState("");
  const [filtrados, setFiltrados] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  
  const [detalhes, setDetalhes] = useState({ 
    series: "3", 
    repeticoes: "12", 
    descanso: "60s",
    carga: "",
    observacoes: ""
  });

  // sincroniza estados ao abrir para editar ou quando um novo é criado
  useEffect(() => {
    if (isOpen) {
      if (exercicioParaEditar) {
        setSelecionado(exercicioParaEditar.fk_exercicio);
        setDetalhes({
          series: exercicioParaEditar.series || "3",
          repeticoes: exercicioParaEditar.repeticoes || "12",
          descanso: exercicioParaEditar.descanso || "60s",
          carga: exercicioParaEditar.carga || "",
          observacoes: exercicioParaEditar.observacoes || ""
        });
      } else if (exercicioCriadoNoMomento) {
        setSelecionado(exercicioCriadoNoMomento);
      }
    }
  }, [exercicioParaEditar, exercicioCriadoNoMomento, isOpen]);

  // filtro da biblioteca
  useEffect(() => {
    const base = Array.isArray(exerciciosBiblioteca) 
      ? exerciciosBiblioteca 
      : (exerciciosBiblioteca.treinos || []);
      
    const termo = String(busca || "").toLowerCase().trim();
    setFiltrados(base.filter(ex => (ex.nome || "").toLowerCase().includes(termo)));
  }, [busca, exerciciosBiblioteca]);

  // limpa estados ao fechar
  useEffect(() => {
    if (!isOpen) {
      setSelecionado(null);
      setBusca("");
      setDetalhes({ series: "3", repeticoes: "12", descanso: "60s", carga: "", observacoes: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <SlideIn from="bottom">
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg p-6 md:p-10 shadow-2xl relative h-[85vh] md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* header */}
          <div className="flex justify-between items-center mb-8 shrink-0">
            <h2 className="text-xl md:text-2xl font-[1000] text-gray-900 uppercase italic tracking-tighter leading-none">
              {exercicioParaEditar ? "editar" : selecionado ? "configurar" : "adicionar"} <span className="text-blue-600">exercício_</span>
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors p-2">
              <FaTimes size={20} />
            </button>
          </div>

          {!selecionado ? (
            <div className="flex flex-col flex-1 overflow-hidden">
              <button
                type="button"
                onClick={() => onOpenCadastroRapido(String(busca || ""))}
                className="w-full flex items-center justify-between p-4 mb-6 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all group shrink-0"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white p-2 rounded-xl">
                    <FaPlus size={10} />
                  </div>
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">não encontrou? criar novo</span>
                </div>
                <FaChevronRight size={10} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative mb-6 shrink-0">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={13} />
                <input
                  autoFocus
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="BUSCAR NA BIBLIOTECA..."
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-600/20 rounded-2xl py-4 pl-14 pr-5 text-[11px] font-bold uppercase outline-none transition-all"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar pb-4">
                {filtrados.length > 0 ? (
                  filtrados.slice(0, 20).map((ex) => (
                    <button
                      key={ex._id || ex.id}
                      type="button"
                      onClick={() => setSelecionado(ex)}
                      className="w-full flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm transition-all group"
                    >
                      <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight italic">
                        {ex.nome}
                      </span>
                      <FaChevronRight size={10} className="text-gray-300 group-hover:text-blue-600 transition-all" />
                    </button>
                  ))
                ) : (
                  <div className="py-10 text-center opacity-40">
                    <p className="text-[10px] font-black uppercase tracking-widest">nenhum resultado...</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
              <button 
                type="button"
                onClick={() => setSelecionado(null)} 
                className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 shrink-0"
              >
                <FaArrowLeft size={10} /> voltar para lista
              </button>

              <div 
                onClick={() => setSelecionado(null)}
                className="bg-gray-900 p-6 rounded-[2rem] mb-6 cursor-pointer hover:bg-blue-900 transition-colors group relative shrink-0"
              >
                 <h3 className="text-white font-black text-lg uppercase italic tracking-tighter leading-none">
                   {selecionado.nome}
                 </h3>
                 <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest mt-1">
                   {exercicioParaEditar ? "clique para trocar exercício" : "ajuste as variáveis abaixo"}
                 </p>
                 <FaRedo className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/50 transition-colors" size={16} />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1.5 ml-1"><FaRedo size={8}/> séries</label>
                  <input 
                    type="number"
                    value={detalhes.series}
                    onChange={e => setDetalhes({...detalhes, series: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-center font-black text-gray-900 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1.5 ml-1"><FaDumbbell size={8}/> reps</label>
                  <input 
                    type="number"
                    value={detalhes.repeticoes}
                    onChange={e => setDetalhes({...detalhes, repeticoes: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-center font-black text-gray-900 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1.5 ml-1"><FaWeightHanging size={8}/> carga</label>
                  <input 
                    placeholder="ex: 10kg"
                    value={detalhes.carga}
                    onChange={e => setDetalhes({...detalhes, carga: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-center font-black text-gray-900 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1.5 ml-1"><FaClock size={8}/> tempo de descanso</label>
                <input 
                  value={detalhes.descanso}
                  onChange={e => setDetalhes({...detalhes, descanso: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-900 focus:border-blue-600 outline-none uppercase text-xs transition-all"
                />
              </div>

              <div className="mt-auto">
                <button 
                  type="button"
                  onClick={() => onSelectExercicio(selecionado, detalhes)}
                  className="w-full bg-black text-white py-5 rounded-2xl font-[1000] uppercase text-[11px] tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <FaCheck size={12} /> {exercicioParaEditar ? "atualizar" : "salvar"} no treino
                </button>
              </div>
            </div>
          )}
        </div>
      </SlideIn>
    </div>
  );
}