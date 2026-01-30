import { useState } from "react";
import SlideIn from "../SlideIn";

export default function ModalNovoProjeto({ onClose, onCreated, alunoId, personalId }) {
  const [formData, setFormData] = useState({
    nome: "",
    objetivo: "",
    descricao: "",
    data_inicio: "",
    data_fim: ""
  });

  const isFormularioInvalido =
  !formData.nome.trim() ||
  !formData.objetivo.trim() ||
  !formData.data_fim;

  const handleSave = async () => {
    if (isFormularioInvalido) return;
    
    if (formData.data_inicio && formData.data_fim < formData.data_inicio) {
      alert("A data final não pode ser menor que a data inicial");
      return;
    }

    const payload = {
      ...formData,
      fk_aluno: alunoId,
      fk_personal: personalId
    };

    try {
      const res = await fetch("http://localhost:3000/projetos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();

      const projeto = await res.json();
      onCreated(projeto);
      onClose();
    } catch {
      alert("Erro ao criar projeto");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[60] flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <SlideIn from="bottom">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-[2.5rem] md:rounded-3xl w-full max-w-md p-5 md:p-7 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
              novo <span className="text-blue-600">projeto</span>
            </h2>
          </div>

          <div className="space-y-4">

            {/* nome */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                nome do projeto
              </label>
              <input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="nome do projeto*"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-light font-montserrat placeholder:font-light focus:ring-2 focus:ring-blue-600/20 outline-none"
              />
            </div>

            {/* objetivo */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                objetivo
              </label>
              <input
                value={formData.objetivo}
                onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                placeholder="objetivo do projeto"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-light font-montserrat placeholder:font-light focus:ring-2 focus:ring-blue-600/20 outline-none"
              />
            </div>

            {/* descrição */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                descrição
              </label>
              <textarea
                rows={3}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="descrição (opcional)"
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-light font-montserrat placeholder:font-light focus:ring-2 focus:ring-blue-600/20 outline-none resize-none"
              />
            </div>

            {/* data inicio */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                data inicial
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-light font-montserrat focus:ring-2 focus:ring-blue-600/20 outline-none"
              />
            </div>

            {/* data fim */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                data final
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-light font-montserrat focus:ring-2 focus:ring-blue-600/20 outline-none"
              />
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex flex-col md:flex-row gap-2 mt-8">
            <button
              onClick={onClose}
              className="flex-1 order-2 md:order-1 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-xl"
            >
              voltar
            </button>

            <button
              disabled={isFormularioInvalido}
              onClick={handleSave}
              className={`flex-[2] order-1 md:order-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${
                  isFormularioInvalido
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 text-white shadow-xl shadow-blue-200 active:scale-95 hover:bg-blue-700"
                }
              `}
            >
              criar projeto
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}