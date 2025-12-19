import { FaTimes, FaCheck } from "react-icons/fa";
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

  const statusOptions = [
    { id: 'A', label: 'ativo' },
    { id: 'S', label: 'suspenso' },
    { id: 'C', label: 'cancelado' }
  ];

  const objetivoOptions = [
    { id: 'hipertrofia', label: 'hipertrofia' },
    { id: 'definicao', label: 'definição' },
    { id: 'emagrecimento', label: 'emagrecimento' },
    { id: 'outro', label: 'outro' }
  ];

  const toggleSelect = (field, id) => {
    const currentValues = Array.isArray(filters[field]) ? filters[field] : [];
    
    if (currentValues.includes(id)) {
      // remove se já estiver selecionado
      setFilters({ ...filters, [field]: currentValues.filter(v => v !== id) });
    } else {
      // adiciona se não estiver selecionado
      setFilters({ ...filters, [field]: [...currentValues, id] });
    }
  };

  return (
    <>
      {/* backdrop - removido o blur */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={onClose}
      />

      {/* painel lateral */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[360px] bg-white z-[101] shadow-2xl flex flex-col">
        
        {/* header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-50">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Filtrar lista</h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">selecione múltiplas opções</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-gray-50 text-gray-400 hover:text-black rounded-xl transition-all"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* corpo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* seção status */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Status da matrícula
            </label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map((opt) => {
                const isSelected = filters.status?.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleSelect('status', opt.id)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all text-xs font-bold uppercase tracking-wider ${
                      isSelected 
                      ? "border-blue-600 bg-blue-50 text-blue-700" 
                      : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    {opt.label}
                    {isSelected && <FaCheck size={10} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* seção objetivo */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Objetivo do treino
            </label>
            <div className="flex flex-wrap gap-2">
              {objetivoOptions.map((opt) => {
                const isSelected = filters.objetivo?.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleSelect('objetivo', opt.id)}
                    className={`px-4 py-2.5 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
                      isSelected 
                      ? "border-black bg-black text-white shadow-md shadow-gray-200" 
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="p-6 bg-white border-t border-gray-100 grid grid-cols-2 gap-3">
          <button 
            onClick={() => {
              const reset = { status: [], objetivo: [] };
              setFilters(reset);
              onApply(reset);
            }}
            className="py-4 rounded-2xl font-bold text-[10px] text-gray-400 hover:text-red-600 transition-colors uppercase tracking-[0.2em]"
          >
            limpar tudo
          </button>
          <button 
            onClick={() => onApply(filters)}
            className="bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg active:scale-95 uppercase"
          >
            aplicar
          </button>
        </div>
      </div>
    </>
  );
}