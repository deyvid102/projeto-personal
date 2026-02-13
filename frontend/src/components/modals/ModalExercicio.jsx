import { useState, useEffect } from "react";
import { FaDumbbell, FaLayerGroup, FaTrashAlt } from "react-icons/fa";
import SlideIn from "../SlideIn";
import SelectPersonalizado from "../SelectPersonalizado";
import Alert from "../Alert"; 
import ModalConfirmacao from "./ModalConfirmacao"; // Importando o novo modal
import { useAlert } from "../hooks/useAlert"; 

export default function ModalExercicio({ onClose, onSave, onDelete, exercicioParaEditar }) {
  const storedUserId = localStorage.getItem("userId");
  const { alert, showAlert } = useAlert(2500);
  
  // Estado para controlar o modal de confirmação de exclusão
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    grupoMuscular: "",
    fk_personal: storedUserId,
    publico: false,
  });

  const opcoesGrupos = [
    { value: "peito", label: "PEITO" },
    { value: "costas", label: "COSTAS" },
    { value: "pernas", label: "PERNAS" },
    { value: "ombros", label: "OMBROS" },
    { value: "braços", label: "BRAÇOS" },
    { value: "abdômen", label: "ABDÔMEN" },
  ];

  useEffect(() => {
    if (exercicioParaEditar) {
      setForm({
        nome: exercicioParaEditar.nome || "",
        grupoMuscular: exercicioParaEditar.grupoMuscular || "",
        fk_personal: storedUserId,
        publico: false,
      });
    }
  }, [exercicioParaEditar, storedUserId]);

  const handleSave = () => {
    if (!form.nome.trim()) {
      showAlert("insira o nome do exercício", "warning");
      return;
    }
    if (!form.grupoMuscular) {
      showAlert("selecione o grupo muscular", "warning");
      return;
    }
    onSave(form); 
  };

  const handleConfirmDelete = () => {
    const idParaDeletar = exercicioParaEditar?._id || exercicioParaEditar?.id;
    if (idParaDeletar && typeof onDelete === "function") {
      onDelete(idParaDeletar);
    }
    setShowConfirmDelete(false);
  };

  const isInvalido = !form.nome.trim() || !form.grupoMuscular;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" 
        onClick={onClose}
      >
        <Alert message={alert.message} type={alert.type} />

        <SlideIn from="bottom">
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-lg p-6 md:p-10 shadow-2xl relative"
          >
            {/* botão de lixeira que agora abre o modal de confirmação */}
            {exercicioParaEditar && (
              <button 
                onClick={() => setShowConfirmDelete(true)}
                className="absolute top-6 right-6 md:top-8 md:right-8 p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex items-center justify-center group z-10"
                title="excluir exercício"
              >
                <FaTrashAlt size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            )}

            <div className="mb-8 pr-12"> 
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                {exercicioParaEditar ? "editar" : "novo"} <span className="text-blue-600">exercício</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-1">
                biblioteca privada
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">nome do exercício</label>
                <div className="relative">
                  <input
                    value={form.nome}
                    onChange={(e) => setForm({...form, nome: e.target.value})}
                    placeholder="EX: SUPINO RETO"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-4 pl-12 text-xs font-bold uppercase focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                  />
                  <FaDumbbell className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">grupo muscular</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-300 pointer-events-none">
                    <FaLayerGroup size={14} />
                  </div>
                  <div className="pl-8">
                    <SelectPersonalizado 
                      options={opcoesGrupos}
                      value={form.grupoMuscular}
                      onChange={(val) => setForm({...form, grupoMuscular: val})}
                      placeholder="SELECIONE..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-10">
              <button 
                onClick={onClose} 
                className="flex-1 order-2 md:order-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all"
              >
                cancelar
              </button>
              <button 
                disabled={isInvalido}
                onClick={handleSave} 
                className={`flex-[2] order-1 md:order-2 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isInvalido 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-95 hover:bg-blue-700"
                }`}
              >
                salvar exercício
              </button>
            </div>
          </div>
        </SlideIn>
      </div>

      {/* modal de confirmação injetado aqui para ficar por cima (z-70) */}
      <ModalConfirmacao 
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        title="excluir?"
        message="essa ação não pode ser desfeita. o exercício será removido permanentemente."
        isCritical={true}
      />
    </>
  );
}