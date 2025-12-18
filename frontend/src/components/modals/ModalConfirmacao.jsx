import SlideIn from "../SlideIn";

export default function ModalConfirmacao({ isOpen, onClose, onConfirm, title, message, isCritical = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
      <SlideIn from="bottom">
        <div className={`rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border-2 ${isCritical ? 'bg-red-600 border-red-400' : 'bg-white border-transparent'}`}>
          <div className="p-8 text-center">
            {/* Título com peso extra para hierarquia */}
            <h3 className={`text-2xl font-black mb-3 uppercase tracking-tighter ${isCritical ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            
            {/* Mensagem principal agora em bold */}
            <p className={`text-sm font-bold leading-relaxed ${isCritical ? 'text-red-100' : 'text-gray-500'}`}>
              {message}
            </p>
          </div>

          <div className={`flex border-t ${isCritical ? 'border-red-400' : 'border-gray-100'}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-4 font-bold text-xs uppercase tracking-widest transition ${isCritical ? 'text-white hover:bg-red-700' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              Voltar
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-4 font-black text-xs uppercase tracking-widest transition ${isCritical ? 'bg-white text-red-600 hover:bg-gray-100' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}