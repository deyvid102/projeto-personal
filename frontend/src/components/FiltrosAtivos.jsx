import { FaTimes } from "react-icons/fa";

export default function FiltrosAtivos({ filtros, removerFiltro, limparTodos, formatarObjetivo, getStatusLabel }) {
  // Ajuste na verificação: agora checa se objetivo tem texto e se idade foi preenchida
  const temFiltros = 
    filtros.status.length > 0 || 
    (filtros.objetivo && filtros.objetivo.trim() !== "") || 
    filtros.idade?.min || 
    filtros.idade?.max;

  if (!temFiltros) return null;

  return (
    <div className="px-4 md:px-0 mb-6 flex flex-wrap items-center gap-2">
      
      {/* status (permanece como array/map) */}
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

      {/* objetivo (agora tratado como STRING única, sem .map) */}
      {filtros.objetivo && filtros.objetivo.trim() !== "" && (
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
          <span className="text-[9px] font-black uppercase tracking-widest">
            Objetivo: {formatarObjetivo(filtros.objetivo)}
          </span>
          <button 
            onClick={() => removerFiltro('objetivo', filtros.objetivo)}
            className="hover:bg-blue-200 p-0.5 rounded-full transition-colors"
          >
            <FaTimes size={10} />
          </button>
        </div>
      )}

      {/* faixa etária */}
      {(filtros.idade?.min || filtros.idade?.max) && (
        <div className="flex items-center gap-2 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
          <span className="text-[9px] font-black uppercase tracking-widest">
            Idade: {filtros.idade.min || "0"} - {filtros.idade.max || "99"} anos
          </span>
          <button 
            onClick={() => removerFiltro('idade', null)}
            className="hover:bg-gray-200 p-0.5 rounded-full transition-colors"
          >
            <FaTimes size={10} />
          </button>
        </div>
      )}

      <button 
        onClick={limparTodos}
        className="text-[9px] font-bold text-gray-400 uppercase underline ml-2 hover:text-red-500 transition-colors"
      >
        limpar filtros
      </button>
    </div>
  );
}