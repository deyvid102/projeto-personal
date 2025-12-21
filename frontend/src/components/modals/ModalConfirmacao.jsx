import SlideIn from "../SlideIn";

export default function ModalConfirmacao({ isOpen, onClose, onConfirm, title, message, isCritical = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-6">
      <SlideIn from="bottom">
        {/* max-w-xs para ser menor que o modal de cadastro */}
        <div className={`rounded-[2rem] w-full max-w-xs overflow-hidden shadow-2xl border-2 ${isCritical ? 'bg-red-600 border-red-400' : 'bg-white border-transparent'}`}>
          <div className="p-6 md:p-8 text-center">
            {/* Título menor e mais agressivo */}
            <h3 className={`text-xl font-[1000] mb-2 uppercase tracking-tighter italic ${isCritical ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            
            <p className={`text-[11px] font-bold leading-relaxed uppercase tracking-tight ${isCritical ? 'text-red-100' : 'text-gray-400'}`}>
              {message}
            </p>
          </div>

          <div className={`flex border-t ${isCritical ? 'border-red-400' : 'border-gray-100'}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-4 font-black text-[10px] uppercase tracking-widest transition-colors ${
                isCritical 
                  ? 'text-white hover:bg-red-700' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              Voltar
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-4 font-[1000] text-[10px] uppercase tracking-widest transition-all ${
                isCritical 
                  ? 'bg-white text-red-600 hover:bg-gray-100' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}