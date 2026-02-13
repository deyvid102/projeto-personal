import { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaDumbbell, FaChevronRight } from "react-icons/fa";
import SlideIn from "../SlideIn";

export default function ModalExercicioTreino({ 
  isOpen, 
  onClose, 
  exerciciosBiblioteca, 
  onSelectExercicio,
  onOpenCadastroRapido // Função que abrirá o ModalExercicio original
}) {
  const [busca, setBusca] = useState("");
  const [filtrados, setFiltrados] = useState([]);

  useEffect(() => {
    if (busca.trim() === "") {
      setFiltrados([]);
    } else {
      const termo = busca.toLowerCase();
      const result = exerciciosBiblioteca.filter(ex => 
        ex.nome.toLowerCase().includes(termo)
      );
      setFiltrados(result);
    }
  }, [busca, exerciciosBiblioteca]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <SlideIn from="bottom">
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg p-6 md:p-10 shadow-2xl relative min-h-[500px] flex flex-col"
        >
          {/* cabeçalho */}
          <div className="mb-6">
            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
              adicionar <span className="text-blue-600">exercício</span>
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              busque na sua biblioteca ou crie um novo
            </p>
          </div>

          {/* campo de busca com o botão + dinâmico */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              <FaSearch size={14} />
            </div>
            <input
              autoFocus
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="NOME DO EXERCÍCIO..."
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-16 text-xs font-bold uppercase focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
            />
            
            {/* botão + que aparece se não houver resultados exatos ou se o usuário quiser criar */}
            <button 
              onClick={() => onOpenCadastroRapido(busca)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-90 flex items-center gap-2 group"
              title="cadastrar novo exercício"
            >
              <div className="relative">
                <FaDumbbell size={14} className="group-hover:rotate-[-15deg] transition-transform" />
                <div className="absolute -top-1 -right-1 bg-black text-white rounded-full p-[0.5px] border border-blue-600">
                  <FaPlus size={5} />
                </div>
              </div>
            </button>
          </div>

          {/* listagem de resultados */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[300px] scrollbar-hide">
            {filtrados.length > 0 ? (
              filtrados.map((ex) => (
                <button
                  key={ex._id}
                  onClick={() => onSelectExercicio(ex)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm text-gray-400 group-hover:text-blue-600 transition-colors">
                      <FaDumbbell size={14} />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-black text-gray-900 uppercase tracking-tighter leading-none">
                        {ex.nome}
                      </p>
                      <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                        {ex.grupoMuscular}
                      </p>
                    </div>
                  </div>
                  <FaChevronRight size={10} className="text-gray-300 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                </button>
              ))
            ) : busca.length > 0 ? (
              <div className="text-center py-10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  nenhum exercício encontrado com esse nome
                </p>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  digite para pesquisar...
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="mt-6 w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
          >
            fechar
          </button>
        </div>
      </SlideIn>
    </div>
  );
}