import SlideIn from "../SlideIn";

export default function ModalConfirmacao({ isOpen, onClose, onConfirm, title, message, isCritical = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
      <SlideIn from="bottom">
        <div className={`rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border-2 ${isCritical ? 'bg-red-600 border-red-400' : 'bg-white border-transparent'}`}>
          <div className="p-6 text-center">
            <h3 className={`text-xl font-bold mb-2 ${isCritical ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <p className={`${isCritical ? 'text-red-100' : 'text-gray-500'}`}>{message}</p>
          </div>

          <div className={`flex border-t ${isCritical ? 'border-red-400' : 'border-gray-100'}`}>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-3 font-medium transition ${isCritical ? 'text-white hover:bg-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Voltar
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 font-bold transition ${isCritical ? 'bg-white text-red-600 hover:bg-gray-100' : 'bg-red-500 text-white hover:bg-red-600'}`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}