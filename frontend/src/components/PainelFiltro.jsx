import { FaTimes, FaCheck, FaSortAlphaDown, FaClock } from "react-icons/fa";
import { useEffect } from "react";
import SlideIn from "./SlideIn";

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

  // Opções reduzidas para o essencial
  const objetivoOptions = [
    { id: 'hipertrofia', label: 'hipertrofia' },
    { id: 'definicao', label: 'definição' },
    { id: 'emagrecimento', label: 'emagrecimento' },
    { id: 'outro', label: 'outro' }
  ];

  const sortOptions = [
    { id: 'nome', label: 'alfabética', icon: <FaSortAlphaDown size={12} /> },
    { id: 'recente', label: 'mais recentes', icon: <FaClock size={11} /> }
  ];

  const toggleSelect = (field, id) => {
    const currentValues = Array.isArray(filters[field]) ? filters[field] : [];
    if (currentValues.includes(id)) {
      setFilters({ ...filters, [field]: currentValues.filter(v => v !== id) });
    } else {
      setFilters({ ...filters, [field]: [...currentValues, id] });
    }
  };

  const handleAgeChange = (type, value) => {
    const val = value === "" ? "" : Math.max(1, parseInt(value));
    setFilters({
      ...filters,
      idade: {
        ...filters.idade,
        [type]: val
      }
    });
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[100] transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 w-full max-w-[340px] z-[101]">
        <SlideIn from="right">
          <div className="h-screen w-full bg-white shadow-2xl flex flex-col">
            
            <div className="p-6 flex justify-between items-center border-b border-gray-50">
              <div>
                <h2 className="text-xl font-[1000] text-gray-900 tracking-tighter uppercase italic">Filtrar lista</h2>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">personalize sua busca</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 hover:text-black rounded-xl transition-all">
                <FaTimes size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-7">
              
              {/* nova seção: ordenação */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Ordenar por
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFilters({ ...filters, ordem: opt.id })}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-tight ${
                        filters.ordem === opt.id 
                          ? "border-blue-600 bg-blue-50 text-blue-700" 
                          : "border-gray-50 bg-gray-50 text-gray-400"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* faixa etária */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Faixa Etária (anos)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number"
                    placeholder="Mín"
                    value={filters.idade?.min || ''}
                    onChange={(e) => handleAgeChange('min', e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-xs font-light focus:border-blue-600 outline-none transition-all"
                  />
                  <input 
                    type="number"
                    placeholder="Máx"
                    value={filters.idade?.max || ''}
                    onChange={(e) => handleAgeChange('max', e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 text-xs font-light focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* status */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Status
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {statusOptions.map((opt) => {
                    const isSelected = filters.status?.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleSelect('status', opt.id)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-[10px] font-bold uppercase tracking-widest ${
                          isSelected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-50 bg-gray-50 text-gray-400"
                        }`}
                      >
                        {opt.label}
                        {isSelected && <FaCheck size={9} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* objetivo reduzido */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Objetivo
                </label>
                <div className="flex flex-wrap gap-2">
                  {objetivoOptions.map((opt) => {
                    const isSelected = filters.objetivo?.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleSelect('objetivo', opt.id)}
                        className={`px-4 py-2.5 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-tight ${
                          isSelected ? "border-black bg-black text-white" : "border-gray-50 bg-gray-50 text-gray-500"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-100 grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  const reset = { status: [], objetivo: [], idade: { min: '', max: '' }, ordem: 'nome' };
                  setFilters(reset);
                  onApply(reset);
                }}
                className="py-4 rounded-xl font-black text-[10px] text-gray-400 uppercase tracking-widest"
              >
                limpar
              </button>
              <button 
                onClick={handleApply}
                className="bg-blue-600 text-white py-4 rounded-xl font-black text-[10px] tracking-widest shadow-lg shadow-blue-100 active:scale-95 uppercase transition-all"
              >
                aplicar
              </button>
            </div>
          </div>
        </SlideIn>
      </div>
    </>
  );
}