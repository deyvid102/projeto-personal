import { useState, useEffect } from "react";
import { FaDumbbell, FaLayerGroup } from "react-icons/fa";
import SlideIn from "../SlideIn";
import SelectPersonalizado from "../SelectPersonalizado";

export default function ModalExercicio({ onClose, onSave, exercicioParaEditar }) {
  const storedUserId = localStorage.getItem("userId");

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
    if (!form.nome.trim() || !form.grupoMuscular) return;
    onSave(form); // envia os dados para a função handleSaveExercicio no pai
  };

  const isInvalido = !form.nome.trim() || !form.grupoMuscular;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4" 
      onClick={onClose}
    >
      <SlideIn from="bottom">
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                {exercicioParaEditar ? "editar" : "novo"} <span className="text-blue-600">exercício</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-1">
                biblioteca privada
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">nome do exercício</label>
              <div className="relative">
                <input
                  value={form.nome}
                  onChange={(e) => setForm({...form, nome: e.target.value})}
                  placeholder="EX: SUPINO RETO"
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3.5 pl-10 text-xs font-bold uppercase focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                />
                <FaDumbbell className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">grupo muscular</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-300 pointer-events-none">
                  <FaLayerGroup size={12} />
                </div>
                <div className="pl-6">
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

          <div className="flex flex-col md:flex-row gap-2 mt-8">
            <button onClick={onClose} className="flex-1 order-2 md:order-1 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all">
              cancelar
            </button>
            <button 
              disabled={isInvalido}
              onClick={handleSave} 
              className={`flex-[2] order-1 md:order-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isInvalido ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-95 hover:bg-blue-700"}`}
            >
              salvar exercício
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}