import { FaTimes } from "react-icons/fa";

export default function FiltrosAtivos({ filtros, removerFiltro, limparTodos, formatarObjetivo, getStatusLabel }) {
  const temFiltros = filtros.status.length > 0 || filtros.objetivo.length > 0;

  if (!temFiltros) return null;

  return (
    <div className="px-4 md:px-0 mb-6 flex flex-wrap items-center gap-2">
      
      {/* Mapeia os Status selecionados */}
      {filtros.status.map((s) => (
        <div key={s} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
          <span className="text-[9px] font-black uppercase tracking-widest">
            Status: {getStatusLabel(s)}
          </span>
          <button 
            onClick={() => removerFiltro('status', s)}
            className="hover:bg-blue-200 p-0.5 rounded-full transition-colors"
          >
            <FaTimes size={10} />
          </button>
        </div>
      ))}

      {/* Mapeia os Objetivos selecionados */}
      {filtros.objetivo.map((obj) => (
        <div key={obj} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
          <span className="text-[9px] font-black uppercase tracking-widest">
            Objetivo: {formatarObjetivo(obj)}
          </span>
          <button 
            onClick={() => removerFiltro('objetivo', obj)}
            className="hover:bg-blue-200 p-0.5 rounded-full transition-colors"
          >
            <FaTimes size={10} />
          </button>
        </div>
      ))}

      <button 
        onClick={limparTodos}
        className="text-[9px] font-bold text-gray-400 uppercase underline ml-2 hover:text-red-500 transition-colors"
      >
        limpar filtros
      </button>
    </div>
  );
}