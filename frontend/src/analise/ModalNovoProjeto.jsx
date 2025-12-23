import { useState } from "react";
import { FaTimes, FaCalendarAlt, FaBullseye } from "react-icons/fa";
import { useAlert } from "../hooks/useAlert";

export default function ModalNovoProjeto({
  alunoId,
  personalId,
  onClose,
  onCreated
}) {
  const { showAlert } = useAlert(2000);

  const [form, setForm] = useState({
    nome: "",
    objetivo: "",
    descricao: "",
    data_inicio: "",
    data_fim: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    if (!form.nome || !form.objetivo || !form.data_fim) {
      showAlert("preencha os campos obrigatórios", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/projetos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fk_aluno: alunoId,
          fk_personal: personalId
        })
      });

      if (!response.ok) throw new Error();

      const projetoCriado = await response.json();
      onCreated(projetoCriado);
      onClose();

      showAlert("projeto criado com sucesso", "success");

    } catch {
      showAlert("erro ao criar projeto", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 shadow-xl relative animate-fade-in">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black uppercase italic tracking-tight">
            Novo Projeto
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Nome */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Nome do projeto *
            </label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="ex: Hipertrofia – Fase 1"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Objetivo */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
              <FaBullseye /> Objetivo *
            </label>
            <input
              name="objetivo"
              value={form.objetivo}
              onChange={handleChange}
              placeholder="ex: ganho de massa muscular"
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Observações
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              placeholder="detalhes importantes do projeto..."
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <FaCalendarAlt /> Data início
              </label>
              <input
                type="date"
                name="data_inicio"
                value={form.data_inicio}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1">
                <FaCalendarAlt /> Data fim *
              </label>
              <input
                type="date"
                name="data_fim"
                value={form.data_fim}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black"
          >
            cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {loading ? "salvando..." : "criar projeto"}
          </button>
        </div>
      </div>
    </div>
  );
}
