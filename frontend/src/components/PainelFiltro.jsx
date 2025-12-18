import { FaTimes } from "react-icons/fa";
import { useEffect } from "react";

export default function PainelFiltro({ isOpen, onClose, onApply, filters, setFilters }) {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const limparFiltros = () => {
    const defaultFilters = { status: "", objetivo: "" };
    setFilters(defaultFilters);
    onApply(defaultFilters);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[100] animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-[380px] bg-white z-[101] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-in-out">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">Filtros</h2>
            <p className="text-xs text-gray-500 font-medium mt-1">refine sua lista de atletas</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-gray-100 text-gray-400 hover:text-black rounded-2xl transition-all"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 tracking-widest">Status da matrícula</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all font-bold text-gray-700 cursor-pointer"
            >
              <option value="">todos os status</option>
              <option value="A">ativo</option>
              <option value="S">suspenso</option>
              <option value="C">cancelado</option>
            </select>
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1 tracking-widest">Objetivo do treino</label>
            <select 
              value={filters.objetivo}
              onChange={(e) => setFilters({...filters, objetivo: e.target.value})}
              className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-4 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all font-bold text-gray-700 cursor-pointer"
            >
              <option value="">todos os objetivos</option>
              <option value="hipertrofia">hipertrofia</option>
              <option value="definicao">definição</option>
              <option value="emagrecimento">emagrecimento</option>
              <option value="outro">objetivos personalizados (outro)</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button 
            onClick={limparFiltros}
            className="flex-1 py-4 rounded-2xl font-bold text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest"
          >
            limpar
          </button>
          <button 
            onClick={() => onApply(filters)}
            className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 uppercase"
          >
            aplicar filtros
          </button>
        </div>
      </div>
    </>
  );
}