import { useState } from "react";

export default function ModalExercicio({ onClose, onSave }) {
  const [form, setForm] = useState({
    nome: "",
    series: "",
    repeticoes: "",
    carga: "",
    descanso: "",
    observacoes: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSave() {
    if (!form.nome) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          Adicionar exercício
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="nome"
            placeholder="Nome do exercício"
            className="col-span-2 border rounded-lg px-3 py-2"
            value={form.nome}
            onChange={handleChange}
          />

          <input
            name="series"
            placeholder="Séries"
            className="border rounded-lg px-3 py-2"
            value={form.series}
            onChange={handleChange}
          />

          <input
            name="repeticoes"
            placeholder="Repetições"
            className="border rounded-lg px-3 py-2"
            value={form.repeticoes}
            onChange={handleChange}
          />

          <input
            name="carga"
            placeholder="Carga"
            className="border rounded-lg px-3 py-2"
            value={form.carga}
            onChange={handleChange}
          />

          <input
            name="descanso"
            placeholder="Descanso"
            className="border rounded-lg px-3 py-2"
            value={form.descanso}
            onChange={handleChange}
          />

          <textarea
            name="observacoes"
            placeholder="Observações (opcional)"
            className="col-span-2 border rounded-lg px-3 py-2"
            rows={3}
            value={form.observacoes}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
